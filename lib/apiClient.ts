import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const axiosInstance = axios.create({
  baseURL,
});

const apiClient = {
  get: async (url: string, params: object = {}) => {
    try {
      const response = await axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw new Error('API request failed.');
    }
  },
  
  post: async (url: string, data: object = {}) => {
    try {
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw new Error('API request failed.');
    }
  },
  put: async (url: string, data: object = {}) => {
    try {
      const response = await axiosInstance.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw new Error('API request failed.');
    }
  },
  delete: async (url: string) => {
    try {
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw new Error('API request failed.');
    }
  },
};

export default apiClient;