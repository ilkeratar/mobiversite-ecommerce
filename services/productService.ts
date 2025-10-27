import apiClient from '@/lib/apiClient';
import { Product, Category, SearchParams } from '@/types';

export const getProducts = async (params: SearchParams = {}): Promise<Product[]> => {
  const products = await apiClient.get('/products', params);
  return products;
};

export const getProductById = async (id: number): Promise<Product> => {
  const product = await apiClient.get(`/products/${id}`);
  return product;
};

export const getCategories = async (): Promise<Category[]> => {
  const categories = await apiClient.get('/categories');
  return categories;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const products = await apiClient.get('/products', { category });
  return products;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const products = await apiClient.get('/products', { q: query });
  return products;
};