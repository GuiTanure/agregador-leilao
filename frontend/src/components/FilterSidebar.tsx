```tsx
import React from "react";
import { PropertyFilters } from "../services/api";

interface FilterSidebarProps {
  filters: PropertyFilters;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilters>>;
  onFilter: () => void;
  onScrape: () => void;
  filterOptions: {
    states: string[];
    cities: string[];
    neighborhoods: string[];
    propertyTypes: string[];
    auctionTypes: string[];
  };
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onFilter,
  onScrape,
  filterOptions,
}) => {
  return (
    <aside className="w-full md:w-72 p-4 bg-white border-r border-gray-200 overflow-y-auto max-h-screen sticky top-0">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>

      <div className="space-y-4">
        {/* State */}
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={filters.state || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, state: e.target.value || undefined }))
            }
          >
            <option value="">Todos</option>
            {filterOptions.states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">Cidade</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={filters.city || ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, city: e.target.value || undefined }))
            }
          >
            <option value="">Todas</option>
            {filterOptions.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Neighborhood */}
        <div>
          <label className="block text-sm font-medium mb-1">Bairro</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={filters.neighborhood || ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                neighborhood: e.target.value || undefined,
              }))
            }
          >
            <option value="">Todos</option>
            {filterOptions.neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-1">Preço (R$)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Mín"
              className="w-1/2 border border-gray-300 rounded px-2 py-1"
              value={filters.priceMin ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  priceMin: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
            <input
              type="number"
              placeholder="Máx"
              className="w-1/2 border border-gray-300 rounded px-2 py-1"
              value={filters.priceMax ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  priceMax: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>
        </div>

        {/* Discount Range */}
        <div>
          <label className="block text-sm font-medium mb-1">Desconto (%)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Mín"
              className="w-1/2 border border-gray-300 rounded px-2 py-1"
              value={filters.discountMin ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  discountMin: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
            <input
              type="number"
              placeholder="Máx"
              className="w-1/2 border border-gray-300 rounded px-2 py-1"
              value={filters.discountMax ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  discountMax: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Imóvel</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={filters.propertyType || ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                propertyType: e.target.value || undefined,
              }))
            }
          >
            <option value="">Todos</option>
            {filterOptions.propertyTypes.map((type) => (
              <option key={type} value