import apiClient from '@/lib/apiClient';
import { Product, Category, SearchParams } from '@/types';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async (params: SearchParams = {}): Promise<Product[]> => {
  await wait(1000);
  const products = await apiClient.get('/products', params);
  return products;
};

export const getProductById = async (id: number): Promise<Product> => {
  await wait(1000);
  const product = await apiClient.get(`/products/${id}`);
  return product;
};

export const getCategories = async (): Promise<Category[]> => {
  await wait(1000);
  const categories = await apiClient.get('/categories');
  return categories;
};
