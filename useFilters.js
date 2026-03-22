import { useState, useEffect } from 'react';
import { getFilterOptions } from '../services/api';

export const useFilters = () => {
  const [filters, setFilters] = useState({});
  const [options, setOptions] = useState({
    states: [],
    cities: [],
    neighborhoods: [],
    propertyTypes: [],
    auctionTypes: [],
  });

  useEffect(() => {
    getFilterOptions().then(setOptions);
  }, []);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return { filters, updateFilter, resetFilters, options };
};