import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoFilters } from '@/types';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState<TodoFilters>({
    status: 'all',
    priority: 'all',
    search: '',
  });

  // Load todos from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(API_URL);
        const parsedTodos = res.data.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Error loading todos from backend:', error);
      }
    })();
  }, []);

  // Save todos to backend whenever todos change
  useEffect(() => {
    if (todos.length === 0) return;
    axios.post(API_URL, todos).catch((error) => {
      console.error('Error saving todos to backend:', error);
    });
  }, [todos]);

  const addTodo = useCallback((todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos(prev => [...prev, newTodo]);
    return newTodo;
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date() }
          : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const getFilteredTodos = useCallback(() => {
    return todos.filter(todo => {
      // Status filter
      if (filters.status === 'completed' && !todo.completed) return false;
      if (filters.status === 'pending' && todo.completed) return false;

      // Priority filter
      if (filters.priority !== 'all' && todo.priority !== filters.priority) return false;

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(searchLower);
        const matchesDescription = todo.description?.toLowerCase().includes(searchLower) || false;
        const matchesTags = todo.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }

      return true;
    });
  }, [todos, filters]);

  const getStats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const highPriority = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;

    return { total, completed, pending, highPriority };
  }, [todos]);

  return {
    todos,
    filteredTodos: getFilteredTodos(),
    filters,
    stats: getStats(),
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    setFilters,
  };
}; 