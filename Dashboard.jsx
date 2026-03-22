// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { getProperties, getFilterOptions, scrapeProperties } from '../services/api';
import PropertyGrid from '../components/PropertyGrid';
import Pagination from '../components/Pagination';
import FilterSidebar from '../components/FilterSidebar';
import { useProperties } from '../hooks/useProperties';

const Dashboard = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({});

  const {
    properties = [],
    total,
    page: currentPage,
    setPage: setCurrentPage
  } = useProperties(filters);

  useEffect(() => {
    getFilterOptions().then(setFilterOptions).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProperties({ ...filters, page })
      .then((data) => {
        if (data) {
          setCurrentPage(data.page || 1);
          setTotalPages(Math.ceil((data.total || 0) / (data.pageSize || 1)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, page]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleScrape = () => {
    scrapeProperties();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="flex">
      <div className="sidebar">
        <FilterSidebar
          onFilter={handleFilterChange}
          onScrape={handleScrape}
          filterOptions={filterOptions}
        />
      </div>

      <div className="container">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <PropertyGrid properties={properties} />
            <Pagination
              currentPage={currentPage || 1}
              totalPages={totalPages || 1}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;