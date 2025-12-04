import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { mockApi } from './mockApi';

// Type definitions for API responses
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 5000, // Shorter timeout to fall back to mock data quickly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to determine if we should use mock API
// Initialize based on environment variable or default to true for development
let useMockApi = process.env.REACT_APP_USE_MOCK_API === 'true' || process.env.NODE_ENV === 'development';

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If we're using mock API, don't make the request
    if (useMockApi) {
      // Return a special error that will be caught by the response interceptor
      const error = new Error('Using mock API') as any;
      error.config = config;
      return Promise.reject(error);
    }

    const token = localStorage.getItem('token');
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Helper function to directly call mock API
const callMockApi = async <T = any>(url: string, method: string, data?: any) => {
  const mockData = await getMockDataForUrl(url, method, data);
  return { data: mockData as T };
};

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle both network errors and mock API mode
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message === 'Using mock API') {
      // Only log the warning if we're not already in mock mode
      if (!useMockApi) {
        console.warn('Backend not available, switching to mock API');
        useMockApi = true;
      }
      
      // Get the URL and method from the error config
      const url = error.config?.url || '';
      const method = error.config?.method?.toUpperCase() || 'GET';
      const data = error.config?.data;
      
      // Get mock data based on the URL and method
      const mockData = await getMockDataForUrl(url, method, data);
      
      // Return a resolved promise with mock data
      return Promise.resolve({ data: mockData });
    }

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      window.location.href = '/account';
    }
    return Promise.reject(error);
  }
);

// Helper function to get mock data based on the URL
const getMockDataForUrl = async (url: string, method: string, data?: any) => {
  // Extract the endpoint from the URL
  const endpoint = url.replace(process.env.REACT_APP_API_URL || 'http://localhost:5000/api', '');
  
  // Handle different endpoints
  if (endpoint === '/products' || endpoint.startsWith('/products')) {
    if (method === 'GET') {
      if (endpoint.includes('/search')) {
        const query = new URLSearchParams(url.split('?')[1]).get('q') || '';
        return mockApi.searchProducts(query);
      } else if (endpoint.includes('?category=')) {
        const category = new URLSearchParams(url.split('?')[1]).get('category') || '';
        return mockApi.getProductsByCategory(category);
      } else if (endpoint.includes('/')) {
        const id = endpoint.split('/')[2];
        return mockApi.getProductById(parseInt(id));
      } else {
        return mockApi.getProducts();
      }
    }
  } else if (endpoint === '/auth/login' && method === 'POST') {
    return mockApi.login(data.email, data.password);
  } else if (endpoint === '/auth/register' && method === 'POST') {
    return mockApi.register(data);
  } else if (endpoint === '/auth/logout' && method === 'POST') {
    return { success: true };
  } else if (endpoint === '/auth/me' && method === 'GET') {
    return mockApi.getCurrentUser();
  } else if (endpoint === '/cart') {
    if (method === 'GET') {
      return mockApi.getCart();
    } else if (method === 'POST') {
      return mockApi.addToCart(data.productId);
    } else if (method === 'DELETE') {
      return mockApi.clearCart();
    }
  } else if (endpoint.startsWith('/cart/') && method === 'DELETE') {
    const itemId = endpoint.split('/')[2];
    return mockApi.removeFromCart(itemId);
  } else if (endpoint.startsWith('/cart/') && method === 'PUT') {
    const itemId = endpoint.split('/')[2];
    return mockApi.updateCartItem(itemId, data.quantity);
  }
  
  // Default fallback
  return null;
};

// API endpoints with fallback to mock API
export const productAPI = {
  getAll: async () => {
    if (useMockApi) {
      return callMockApi('/products', 'GET');
    }
    
    try {
      return await api.get('/products');
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
  getById: async (id: string) => {
    if (useMockApi) {
      return callMockApi(`/products/${id}`, 'GET');
    }
    
    try {
      return await api.get(`/products/${id}`);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
  getByCategory: async (category: string) => {
    if (useMockApi) {
      return callMockApi(`/products?category=${category}`, 'GET');
    }
    
    try {
      return await api.get(`/products?category=${category}`);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
  search: async (query: string) => {
    if (useMockApi) {
      return callMockApi(`/products/search?q=${query}`, 'GET');
    }
    
    try {
      return await api.get(`/products/search?q=${query}`);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
};

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    if (useMockApi) {
      return callMockApi<AuthResponse>('/auth/login', 'POST', credentials);
    }
    
    try {
      return await api.post<AuthResponse>('/auth/login', credentials);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
  register: async (userData: { name: string; email: string; password: string }) => {
    if (useMockApi) {
      return callMockApi<AuthResponse>('/auth/register', 'POST', userData);
    }
    
    try {
      return await api.post<AuthResponse>('/auth/register', userData);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
  logout: async () => {
    if (useMockApi) {
      return callMockApi('/auth/logout', 'POST');
    }
    
    try {
      return await api.post('/auth/logout');
    } catch (error) {
      console.warn('Backend not available, switching to mock API');
      useMockApi = true;
      return callMockApi('/auth/logout', 'POST');
    }
  },
  getCurrentUser: async () => {
    if (useMockApi) {
      return callMockApi<AuthResponse['user']>('/auth/me', 'GET');
    }
    
    try {
      return await api.get<AuthResponse['user']>('/auth/me');
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
};

export const cartAPI = {
  get: async () => {
    if (useMockApi) {
      return callMockApi('/cart', 'GET');
    }
    
    try {
      return await api.get('/cart');
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
  add: async (productId: number) => {
    if (useMockApi) {
      return callMockApi('/cart', 'POST', { productId });
    }
    
    try {
      return await api.post('/cart', { productId });
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
  update: async (itemId: string, quantity: number) => {
    if (useMockApi) {
      return callMockApi(`/cart/${itemId}`, 'PUT', { quantity });
    }
    
    try {
      return await api.put(`/cart/${itemId}`, { quantity });
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
  remove: async (itemId: string) => {
    if (useMockApi) {
      return callMockApi(`/cart/${itemId}`, 'DELETE');
    }
    
    try {
      return await api.delete(`/cart/${itemId}`);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
  clear: async () => {
    if (useMockApi) {
      return callMockApi('/cart', 'DELETE');
    }
    
    try {
      return await api.delete('/cart');
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
};

export default api;
