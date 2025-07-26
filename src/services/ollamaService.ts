import axios from 'axios';
import { OllamaResponse, OllamaConfig, Todo } from '@/types';

class OllamaService {
  private config: OllamaConfig;

  constructor(config: OllamaConfig) {
    this.config = config;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${this.config.baseUrl}/api/generate`, {
        model: this.config.model,
        prompt,
        stream: false,
        options: {
          temperature: this.config.temperature || 0.7,
          num_predict: this.config.maxTokens || 1000,
        },
      });

      return response.data.response;
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async addTodoFromPrompt(userPrompt: string, existingTodos: Todo[]): Promise<Partial<Todo>> {
    const systemPrompt = `You are a helpful AI assistant that helps manage a todo list. 
    The user wants to add a new todo item. Please extract the todo information from their request.
    
    Current todos: ${JSON.stringify(existingTodos.map(t => ({ title: t.title, completed: t.completed })))}
    
    Return a JSON object with the following structure:
    {
      "title": "The todo title",
      "description": "Optional description",
      "priority": "low|medium|high",
      "dueDate": "YYYY-MM-DD (optional)",
      "tags": ["tag1", "tag2"]
    }
    
    User request: ${userPrompt}`;

    const response = await this.generateResponse(systemPrompt);
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: create a simple todo
      return {
        title: userPrompt,
        priority: 'medium',
        tags: [],
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        title: userPrompt,
        priority: 'medium',
        tags: [],
      };
    }
  }

  async editTodoFromPrompt(userPrompt: string, todo: Todo, allTodos: Todo[]): Promise<Partial<Todo>> {
    const systemPrompt = `You are a helpful AI assistant that helps manage a todo list.
    The user wants to edit an existing todo item. Please understand their request and provide the updated information.
    
    Current todo to edit: ${JSON.stringify(todo)}
    All todos: ${JSON.stringify(allTodos.map(t => ({ id: t.id, title: t.title, completed: t.completed })))}
    
    Return a JSON object with only the fields that should be updated:
    {
      "title": "Updated title (if changed)",
      "description": "Updated description (if changed)",
      "priority": "low|medium|high (if changed)",
      "completed": true/false (if changed),
      "dueDate": "YYYY-MM-DD (if changed)",
      "tags": ["tag1", "tag2"] (if changed)
    }
    
    User request: ${userPrompt}`;

    const response = await this.generateResponse(systemPrompt);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {};
    }
  }

  async getSuggestions(todos: Todo[]): Promise<string[]> {
    const systemPrompt = `You are a helpful AI assistant that provides suggestions for todo management.
    Based on the current todos, provide 3 helpful suggestions for the user.
    
    Current todos: ${JSON.stringify(todos)}
    
    Return a JSON array of suggestions:
    ["suggestion 1", "suggestion 2", "suggestion 3"]`;

    const response = await this.generateResponse(systemPrompt);
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      return [];
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await axios.get(`${this.config.baseUrl}/api/tags`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default OllamaService; 