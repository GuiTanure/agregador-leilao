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
  condoFeeCondition?: string;
  iptuCondition?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Stats {
  totalProperties: number;
  activeAuctions: number;
  finishedAuctions: number;
}

const api = axios.create({
  baseURL: '/api',
});

export const getProperties = async (filters: PropertyFilters): Promise<PropertiesResponse> => {
  const params: any = { ...filters };
  return api.get('/properties', { params }).then(res => res.data);
};

export const getProperty = async (id: number): Promise<Property> => {
  return api.get(`/properties/${id}`).then(res => res.data);
};

export const getFilterOptions = async (): Promise<FilterOptions> => {
  return api.get('/properties/filters').then(res => res.data);
};

export const scrapeProperties = async (): Promise<void> => {
  return api.post('/scraper/scrape').then(() => {});
};

export const getStats = async (): Promise<Stats> => {
  return api.get('/properties/stats').then(res => res.data);
};
```