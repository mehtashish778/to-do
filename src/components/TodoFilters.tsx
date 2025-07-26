import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TodoFilters as TodoFiltersType } from '@/types';

interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFiltersChange: (filters: TodoFiltersType) => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
  };
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  filters,
  onFiltersChange,
  stats,
}) => {
  const updateFilter = (key: keyof TodoFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      priority: 'all',
      search: '',
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.search;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search todos..."
            className="input-field pl-10"
          />
        </div>

        {/* Status and Priority Filters */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="input-field"
            >
              <option value="all">All ({stats.total})</option>
              <option value="pending">Pending ({stats.pending})</option>
              <option value="completed">Completed ({stats.completed})</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value)}
              className="input-field"
            >
              <option value="all">All</option>
              <option value="high">High ({stats.highPriority})</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">{stats.highPriority}</div>
            <div className="text-xs text-gray-500">High Priority</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 