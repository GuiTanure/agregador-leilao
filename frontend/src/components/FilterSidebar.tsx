```tsx
import React, { useState } from 'react';
import { PropertyFilters, FilterOptions } from '../services/api';

interface FilterSidebarProps {
  filters: PropertyFilters;
  options: FilterOptions;
  updateFilter: (key: keyof PropertyFilters, value: any) => void;
  onFilter: () => void;
  onScrape: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  options,
  updateFilter,
  onFilter