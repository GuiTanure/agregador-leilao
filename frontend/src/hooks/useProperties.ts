```typescript
import { useState, useEffect } from 'react';
import { Property, PropertiesResponse, PropertyFilters, getProperties } from '../services/api';

export const useProperties = (filters: PropertyFilters) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(filters.page || 1);
  const [pageSize, setPageSize] = useState(filters.pageSize || 12);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response: PropertiesResponse = await getProperties({ ...filters, page, pageSize });
        setProperties(response.properties);
        setTotal(response.total);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters, page, pageSize]);

  const setPageNumber = (newPage: number) => {
    setPage(newPage);
  };

  return {
    properties,
    total,
    page,
    pageSize,
    loading,
    setPage: setPageNumber,
  };
};
```