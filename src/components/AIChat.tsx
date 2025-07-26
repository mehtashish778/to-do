import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage, Todo } from '@/types';
import { cn } from '@/utils/cn';

interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isConnected: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  isConnected,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .split('\n')
      .map((line, i) => (
        <React.Fragment key={i}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
          {i < content.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
  };

  return (
    <div className="card h-96 flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <Bot className="w-5 h-5 text-primary-600" />
        <h3 className="font-medium text-gray-900">AI Assistant</h3>
        <div className={cn(
          "ml-auto w-2 h-2 rounded-full",
          isConnected ? "bg-green-500" : "bg-red-500"
        )} />
        <span className="text-xs text-gray-500">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">
              {isConnected 
                ? "Ask me to add, edit, or manage your todos!"
                : "Connect to Ollama to start chatting"
              }
            </p>
            {isConnected && (
              <div className="mt-4 text-xs text-gray-400 space-y-1">
                <p>Try: "Add a high priority task to review the quarterly report"</p>
                <p>Try: "Mark the first todo as completed"</p>
                <p>Try: "What suggestions do you have for my todo list?"</p>
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  message.role === 'user'
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                {message.role === 'assistant' 
                  ? formatMessage(message.content)
                  : message.content
                }
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isConnected ? "Ask me anything about your todos..." : "Connect to Ollama first"}
          disabled={!isConnected || isLoading}
          className="input-field flex-1 text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || !isConnected || isLoading}
          className="btn-primary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}; 