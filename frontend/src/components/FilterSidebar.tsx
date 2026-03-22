```tsx
import React, { useState } from 'react';
import { PropertyFilters } from '../services/api';

interface FilterSidebarProps {
  filters: PropertyFilters;
  options: {
    states: string[];
    cities: string[];
    neighborhoods: string[];
    propertyTypes: string[];
    auctionTypes: string[];
  };
  updateFilter: (key: keyof PropertyFilters, value: any) => void;
  onFilter: () => void;
  onScrape: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  options,
  updateFilter,
  onFilter,
  onScrape,
}) => {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);

  const handleChange = (key: keyof PropertyFilters, value: any) => {
    setLocalFilters((prev