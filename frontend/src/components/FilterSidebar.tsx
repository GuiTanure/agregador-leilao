```tsx
import React from 'react';
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
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cidade</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.city || ''}
            onChange={e => updateFilter('city', e.target.value || undefined)}
          >
            <option value="">Todas</option>
            {options.cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bairro</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.neighborhood || ''}
            onChange={e => updateFilter('neighborhood', e.target.value || undefined)}
          >
            <option value="">Todos</option>
            {options.neighborhoods.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Faixa de Preço (R$)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 border rounded px-2 py-1"
              value={filters.priceMin ?? ''}
              onChange={e => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
              min={0}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 border rounded px-2 py-1"
              value={filters.priceMax ?? ''}
              onChange={e => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
              min={0}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Faixa de Desconto (%)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 border rounded px-2 py-1"
              value={filters.discountMin ?? ''}
              onChange={e => updateFilter('discountMin', e.target.value ? Number(e.target.value) : undefined)}
              min={0}
              max={100}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 border rounded px-2 py-1"
              value={filters.discountMax ?? ''}
              onChange={e => updateFilter('discountMax', e.target.value ? Number(e.target.value) : undefined)}
              min={0}
              max={100}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Imóvel</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.propertyType || ''}
            onChange={e => updateFilter('propertyType', e.target.value || undefined)}
          >
            <option value="">Todos</option>
            {options.propertyTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Leilão</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.auctionType || ''}
            onChange={e => updateFilter('auctionType', e.target.value || undefined)}
          >
            <option value="">Todos</option>
            {options.auctionTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="fgts"
            checked={filters.acceptsFGTS || false}
            onChange={e => updateFilter('acceptsFGTS', e.target.checked ? true : undefined)}
          />
          <label htmlFor="fgts" className="text-sm