import { useState, useEffect } from 'react';
import { getProperties, PropertyFilters } from '../services/api';

export const useProperties = (filters) => {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(filters.page || 1);
  const [pageSize, setPageSize] = useState(filters.pageSize || 12);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProperties({ ...filters, page, pageSize })
      .then((data) => {
        setProperties(data.properties);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [filters, page, pageSize]);

  return { properties, total, page, setPage, setPageSize, loading };
};