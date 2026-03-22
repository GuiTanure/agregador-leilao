// src/services/api.js

export const getProperties = async (filters) => {
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`/api/properties?${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
};

export const getProperty = async (id) => {
  const response = await fetch(`/api/properties/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch property details');
  }
  return response.json();
};

export const getFilterOptions = async () => {
  const response = await fetch('/api/properties/filters');
  if (!response.ok) {
    throw new Error('Failed to fetch filter options');
  }
  return response.json();
};

export const scrapeProperties = async () => {
  const response = await fetch('/api/scraper/scrape', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to update data');
  }
  return response.json();
};

export const getStats = async () => {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
};