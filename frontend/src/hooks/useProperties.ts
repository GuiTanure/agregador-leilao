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
    setLoading(true);
    getProperties({ ...filters, page, pageSize })
      .then((data: PropertiesResponse) => {
        setProperties(data.properties);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [filters, page, pageSize]);

  return { properties, total, page, pageSize, setPage, setPageSize, loading };
};
```