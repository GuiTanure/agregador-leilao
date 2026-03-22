import React from 'react';
import { useFilters } from '../hooks/useFilters';

const FilterSidebar = ({ onFilter, onScrape }) => {
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
            onChange={(e) => updateFilter('state', e.target.value || undefined)}
          >
            <option value="">Todos</option>
            {options.states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cidade</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.city || ''}
            onChange={(e) => updateFilter('city', e.target.value || undefined)}
          >
            <option value="">Todas</option>
            {options.cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bairro</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.neighborhood || ''}
            onChange={(e) => updateFilter('neighborhood', e.target.value || undefined)}
          >
            <option value="">Todos</option>
            {options.neighborhoods.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        {/* Additional filter controls can be added here following the same pattern */}
        <button
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          onClick={onFilter}
        >
          Filtrar
        </button>
        <button
          className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          onClick={onScrape}
        >
          Atualizar dados
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;