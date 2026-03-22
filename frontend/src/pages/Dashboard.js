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
  const { properties, total, page: currentPage, setPage: setCurrentPage } = useProperties(filters);
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    getFilterOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProperties({ ...filters, page }).then((data) => {
      setCurrentPage(data.page);
      setTotalPages(Math.ceil(data.total / data.pageSize));
      setLoading(false);
    });
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
      <FilterSidebar
        onFilter={(newFilters) => handleFilterChange(newFilters)}
        onScrape={handleScrape}
      />
      <div className="flex-1 p-4">
        <button
          className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleScrape}
        >
          Atualizar dados
        </button>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <PropertyGrid properties={properties} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;