```typescript
import { useState, useEffect } from 'react';
import { Property, PropertiesResponse, PropertyFilters, getProperties } from '../services/api';

export const useProperties = (filters: PropertyFilters, pageSize = 12) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data: PropertiesResponse = await getProperties(filters, page, pageSize);
      setProperties(data.properties);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

  return {
    properties,
    total,
    page,
    pageSize,
    setPage,
    loading,
    refresh: fetchProperties,
  };
};
```