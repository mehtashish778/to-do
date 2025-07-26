import React, { useState } from 'react';
import { Todo } from '@/types';
import { Check, Edit, Trash2, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return null;
  };

  if (isEditing) {
    return (
      <div className="card animate-slide-up">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="input-field font-medium"
            placeholder="Todo title"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="input-field resize-none h-20"
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="btn-primary text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "card transition-all duration-200 hover:shadow-md",
      todo.completed && "opacity-75 bg-gray-50"
    )}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={cn(
            "flex-shrink-0 w-6 h-6 rounded-full border-2 transition-colors duration-200",
            todo.completed
              ? "bg-primary-600 border-primary-600 text-white"
              : "border-gray-300 hover:border-primary-400"
          )}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-gray-900 break-words",
                todo.completed && "line-through text-gray-500"
              )}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={cn(
                  "text-sm text-gray-600 mt-1 break-words",
                  todo.completed && "line-through"
                )}>
                  {todo.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full",
                  getPriorityColor(todo.priority)
                )}>
                  {getPriorityIcon(todo.priority)}
                  {todo.priority}
                </span>

                {todo.dueDate && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                )}

                {todo.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{todo.tags.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit todo"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete todo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 