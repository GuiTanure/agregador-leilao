```typescript
import axios from 'axios';

export interface Property {
  id: number;
  image: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  salePrice: number;
  evaluationPrice: number;
  discountPercent: number;
  tags: string[];
  auctionDate: string;
  area: number;
  bedrooms: number;
  parkingSpaces: number;
  occupied: boolean;
  acceptsFGTS: boolean;
  acceptsFinancing: boolean;
  inDispute: boolean;
  auctionStatus: 'active' | 'finished';
  condoFee: number;
  iptu: number;
  auctionType: 'Leilão SFI' | 'Venda Online' | 'Licitação Aberta';
  neighborhood: string;
}

export interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterOptions {
  states: string[];
  cities: string[];
  neighborhoods: string[];
  propertyTypes: string[];
  auctionTypes: string[];
  auctionStatuses: string[];
}

export interface PropertyFilters {
  state?: string;
  city?: string;
  neighborhood?: string;
  priceMin?: number;
  priceMax?: number;
  discountMin?: number;
  discountMax?: number;
  propertyType?: string;
  auctionType?: string;
  acceptsFGTS?: boolean;
  acceptsFinancing?: boolean;
  inDispute?: boolean;
  auctionStatus?: 'active' | 'finished';
  areaMin?: number;
  areaMax?: number;
  auctionDateStart?: string;
  auctionDateEnd?: string;
  condoFeeMin?: number;
  condoFeeMax?: number;
  iptuMin?: number;
  iptuMax?: number;
}

export interface Stats {
  totalProperties: number;
  activeAuctions: number;
  finishedAuctions: number;
}

const api = axios.create({
  baseURL: '/api',
});

export const getProperties = async (
  filters: PropertyFilters,
  page: number,
  pageSize: number
): Promise<PropertiesResponse> => {
  const params: any = {
    page,
    pageSize,
    ...filters,
  };
  const response = await api.get('/properties', { params });
  return response.data;
};

export const getProperty = async (id: number): Promise<Property> => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

export const getFilterOptions = async (): Promise<FilterOptions> => {
  const response = await api.get('/properties/filters');
  return response.data;
};

export const scrapeProperties = async (): Promise<void> => {
  await api.post('/scraper/scrape');
};

export const getStats = async (): Promise<Stats> => {
  const response = await api.get('/properties/stats');
  return response.data;
};
```