import React, { useState, useEffect, useCallback } from 'react';
import { Bot, CheckSquare, Settings, Trash2 } from 'lucide-react';
import { Todo, ChatMessage, OllamaConfig } from '@/types';
import { useTodos } from '@/hooks/useTodos';
import OllamaService from '@/services/ollamaService';
import { TodoForm } from '@/components/TodoForm';
import { TodoItem } from '@/components/TodoItem';
import { TodoFilters } from '@/components/TodoFilters';
import { AIChat } from '@/components/AIChat';
import { OllamaSettings } from '@/components/OllamaSettings';

const DEFAULT_OLLAMA_CONFIG: OllamaConfig = {
  baseUrl: 'http://localhost:11434',
  model: 'mistral-small',
  temperature: 0.7,
  maxTokens: 1000,
};

function App() {
  const {
    todos,
    filteredTodos,
    filters,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    setFilters,
  } = useTodos();

  const [ollamaConfig, setOllamaConfig] = useState<OllamaConfig>(DEFAULT_OLLAMA_CONFIG);
  const [ollamaService, setOllamaService] = useState<OllamaService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'todos' | 'ai'>('todos');

  // Initialize Ollama service when config changes
  useEffect(() => {
    const service = new OllamaService(ollamaConfig);
    setOllamaService(service);
  }, [ollamaConfig]);

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      if (ollamaService) {
        try {
          const connected = await ollamaService.checkConnection();
          setIsConnected(connected);
        } catch (error) {
          setIsConnected(false);
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [ollamaService]);

  const handleTestConnection = useCallback(async (): Promise<boolean> => {
    if (!ollamaService) return false;
    try {
      const connected = await ollamaService.checkConnection();
      setIsConnected(connected);
      return connected;
    } catch (error) {
      setIsConnected(false);
      return false;
    }
  }, [ollamaService]);

  const handleChatMessage = useCallback(async (message: string) => {
    if (!ollamaService || !isConnected) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: message,
      role: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Check if the message is about adding a todo
      const addKeywords = ['add', 'create', 'new', 'todo', 'task'];
      const isAddRequest = addKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );

      // Check if the message is about editing a todo
      const editKeywords = ['edit', 'update', 'change', 'modify'];
      const isEditRequest = editKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );

      let aiResponse = '';

      if (isAddRequest) {
        const todoData = await ollamaService.addTodoFromPrompt(message, todos);
        if (todoData.title) {
          const newTodo = addTodo({
            title: todoData.title,
            description: todoData.description,
            completed: false,
            priority: todoData.priority || 'medium',
            dueDate: todoData.dueDate ? new Date(todoData.dueDate) : undefined,
            tags: todoData.tags || [],
          });
          aiResponse = `✅ Added new todo: "${newTodo.title}"`;
        } else {
          aiResponse = "I couldn't understand what todo you wanted to add. Please try being more specific.";
        }
      } else if (isEditRequest && todos.length > 0) {
        // For simplicity, edit the first todo that matches the description
        const matchingTodo = todos.find(todo => 
          message.toLowerCase().includes(todo.title.toLowerCase())
        );
        
        if (matchingTodo) {
          const updates = await ollamaService.editTodoFromPrompt(message, matchingTodo, todos);
          if (Object.keys(updates).length > 0) {
            updateTodo(matchingTodo.id, updates);
            aiResponse = `✅ Updated todo: "${matchingTodo.title}"`;
          } else {
            aiResponse = "I couldn't understand what changes you wanted to make. Please try being more specific.";
          }
        } else {
          aiResponse = "I couldn't find a todo to edit. Please specify which todo you want to modify.";
        }
      } else {
        // General conversation or suggestions
        const suggestions = await ollamaService.getSuggestions(todos);
        if (suggestions.length > 0) {
          aiResponse = `Here are some suggestions for your todo list:\n\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
        } else {
          aiResponse = "I'm here to help you manage your todos! You can ask me to add new tasks, edit existing ones, or get suggestions for better organization.";
        }
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: "Sorry, I encountered an error. Please check your Ollama connection and try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [ollamaService, isConnected, todos, addTodo, updateTodo]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI-Powered Todo App
          </h1>
          <p className="text-gray-600">
            Manage your tasks with the help of Ollama AI
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'todos'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CheckSquare className="w-4 h-4 inline mr-2" />
              Todos
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'ai'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bot className="w-4 h-4 inline mr-2" />
              AI Chat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <OllamaSettings
              config={ollamaConfig}
              onConfigChange={setOllamaConfig}
              onTestConnection={handleTestConnection}
              isConnected={isConnected}
            />

            {activeTab === 'todos' && (
              <>
                <TodoForm onAddTodo={addTodo} />
                <TodoFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  stats={stats}
                />
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'todos' ? (
              <div className="space-y-4">
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Todos ({filteredTodos.length})
                  </h2>
                  {stats.completed > 0 && (
                    <button
                      onClick={clearCompleted}
                      className="btn-secondary text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear completed
                    </button>
                  )}
                </div>

                {/* Todo List */}
                {filteredTodos.length === 0 ? (
                  <div className="card text-center py-12">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                        ? 'No todos match your filters'
                        : 'No todos yet'
                      }
                    </h3>
                    <p className="text-gray-500">
                      {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                        ? 'Try adjusting your filters or add a new todo.'
                        : 'Get started by adding your first todo!'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onUpdate={updateTodo}
                        onDelete={deleteTodo}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <AIChat
                messages={chatMessages}
                onSendMessage={handleChatMessage}
                isLoading={isLoading}
                isConnected={isConnected}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 