```tsx
import React, { useState } from 'react';
import { useFilters } from '../hooks/useFilters';

interface FilterSidebarProps {
  onFilter: () => void;
  onScrape: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilter, onScrape }) => {
  const { filters, updateFilter, options } = useFilters();

  return (
    <aside className="w-full md:w-72 p-4 bg-white border-r border-gray-200 overflow-y-auto max-h-screen sticky top-0">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.state || ''}
            onChange={e => updateFilter('state', e.target.value || undefined)}
          >
            <option value="">Todos</option>
            {options.states.map(s => (
              <option key={s} value={s}>{s}</option>