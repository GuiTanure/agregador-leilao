```typescript
import { useState, useEffect } from 'react';
import { PropertyFilters, FilterOptions, getFilterOptions } from '../services/api';

export const useFilters = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [options, setOptions] = useState<FilterOptions>({
    states: [],
    cities: [],
    neighborhoods: [],
    propertyTypes: [],
    auctionTypes: [],
  });

  useEffect(() => {
    getFilterOptions().then(setOptions);
  }, []);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return { filters, updateFilter, resetFilters, options };
};
```