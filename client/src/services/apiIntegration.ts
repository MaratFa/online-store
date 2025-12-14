
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Import configuration
import { config } from '../config';

// Import our API modules
import * as productApi from './api/productApi';
import * as userApi from './api/userApi';
import * as orderApi from './api/orderApi';

// Import mock API
import { mockApi } from "./mockApi";

// Create axios instance
export const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
});

// Flag to determine if we should use mock API
// Always use mock API for now until backend is deployed
let useMockApi = true;

// Helper function to directly call mock API
const callMockApi = async <T = any>(
  url: string,
  method: string,
  data?: any
) => {
  const mockData = await getMockDataForUrl(url, method, data);

  // Ensure we always return a valid response
  if (mockData === null && url.includes("/products")) {
    console.warn("Mock API: Returning empty products array as fallback");
    return { data: [] as T };
  }

  return { data: mockData as T };
};

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle both network errors and mock API mode
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message === "Using mock API"
    ) {
      console.warn("API unavailable, falling back to mock data");

      // Extract URL and method from the failed request
      const url = error.config?.url || "";
      const method = error.config?.method?.toUpperCase() || "GET";
      const data = error.config?.data;

      return callMockApi(url, method, data);
    }

    return Promise.reject(error);
  }
);

// Request interceptor to add auth token and handle mock API mode
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (useMockApi) {
      // If using mock API, reject the request with a special error message
      return Promise.reject(new Error("Using mock API"));
    }

    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// Helper function to get mock data for a specific URL
const getMockDataForUrl = async (url: string, method: string, data?: any) => {
  // This function would map URLs to the appropriate mock API calls
  // For now, we'll use the existing mockApi structure

  // Parse the URL to determine which mock function to call
  if (url.includes("/products")) {
    if (url.includes("/search")) {
      const query = url.split("q=")[1] || "";
      return mockApi.searchProducts(query);
    } else if (url.match(/\/products\/\d+$/)) {
      const id = url.split("/").pop();
      return mockApi.getProductById(Number(id));
    } else if (url.includes("/category")) {
      const category = url.split("/category/")[1] || "All";
      return mockApi.getProductsByCategory(category);
    } else {
      return mockApi.getProducts();
    }
  } else if (url.includes("/auth")) {
    if (url.includes("/login")) {
      return mockApi.login(data.email, data.password);
    } else if (url.includes("/register")) {
      return mockApi.register(data);
    }
  } else if (url.includes("/cart")) {
    if (method === "GET") {
      return mockApi.getCart();
    } else if (method === "POST") {
      return mockApi.addToCart(data.productId);
    } else if (method === "PUT") {
      const itemId = url.split("/").pop();
      const itemIdStr = itemId || "";
      return mockApi.updateCartItem(itemIdStr, data.quantity);
    } else if (method === "DELETE") {
      if (url === "/cart") {
        return mockApi.clearCart();
      } else {
        const itemId = url.split("/").pop();
        const itemIdStr = itemId || "";
        return mockApi.removeFromCart(itemIdStr);
      }
    }
  } else if (url.includes("/orders")) {
    if (method === "GET") {
      return mockApi.getAllOrders();
    } else if (method === "POST") {
      return mockApi.createOrder(data);
    } else if (url.match(/\/orders\/\d+$/)) {
      const orderId = url.split("/").pop();
      const orderIdStr = orderId || "";
      return mockApi.getOrderById(orderIdStr);
    }
  } else if (url.includes("/user/profile")) {
    if (method === "GET") {
      return mockApi.getCurrentUser();
    } else if (method === "PUT") {
      return mockApi.updateOrder("profile", data);
    }
  }

  return null;
};

// Create integrated API objects that use our API modules but with fallback
export const productAPI = {
  getAll: async () => {
    if (useMockApi) {
      const products = await mockApi.getProducts();
      return { data: products };
    }
    try {
      return await productApi.fetchProducts();
    } catch (error) {
      console.warn("Product API failed, falling back to mock data");
      const products = await mockApi.getProducts();
      return { data: products };
    }
  },

  getById: async (id: number) => {
    if (useMockApi) {
      const product = await mockApi.getProductById(id);
      return { data: product };
    }
    try {
      return await productApi.fetchProductById(id);
    } catch (error) {
      console.warn("Product API failed, falling back to mock data");
      const product = await mockApi.getProductById(id);
      return { data: product };
    }
  },

  search: async (query: string) => {
    if (useMockApi) {
      const products = await mockApi.searchProducts(query);
      return { data: products };
    }
    try {
      return await productApi.searchProducts(query);
    } catch (error) {
      console.warn("Product API failed, falling back to mock data");
      const products = await mockApi.searchProducts(query);
      return { data: products };
    }
  },
  
  getByCategory: async (category: string) => {
    if (useMockApi) {
      const products = await mockApi.getProductsByCategory(category);
      return { data: products };
    }
    try {
      return await productApi.getProductsByCategory(category);
    } catch (error) {
      console.warn("Product API failed, falling back to mock data");
      const products = await mockApi.getProductsByCategory(category);
      return { data: products };
    }
  },
};

export const userAPI = {
  login: async (email: string, password: string) => {
    if (useMockApi) {
      return mockApi.login(email, password);
    }
    try {
      return await userApi.loginUser(email, password);
    } catch (error) {
      console.warn("User API failed, falling back to mock data");
      return mockApi.login(email, password);
    }
  },

  register: async (userData: any) => {
    if (useMockApi) {
      return mockApi.register(userData);
    }
    try {
      return await userApi.registerUser(userData);
    } catch (error) {
      console.warn("User API failed, falling back to mock data");
      return mockApi.register(userData);
    }
  },

  getProfile: async (token: string) => {
    if (useMockApi) {
      return mockApi.getCurrentUser();
    }
    try {
      return await userApi.getUserProfile(token);
    } catch (error) {
      console.warn("User API failed, falling back to mock data");
      return mockApi.getCurrentUser();
    }
  },

  updateProfile: async (token: string, userData: any) => {
    if (useMockApi) {
      return mockApi.updateOrder("profile", userData);
    }
    try {
      return await userApi.updateUserProfile(token, userData);
    } catch (error) {
      console.warn("User API failed, falling back to mock data");
      return mockApi.updateOrder("profile", userData);
    }
  },
};

export const orderAPI = {
  create: async (orderData: any, token: string) => {
    if (useMockApi) {
      return mockApi.createOrder(orderData);
    }
    try {
      return await orderApi.createOrder(orderData, token);
    } catch (error) {
      console.warn("Order API failed, falling back to mock data");
      return mockApi.createOrder(orderData);
    }
  },

  getById: async (orderId: string, token: string) => {
    if (useMockApi) {
      return mockApi.getOrderById(orderId);
    }
    try {
      return await orderApi.getOrderById(orderId, token);
    } catch (error) {
      console.warn("Order API failed, falling back to mock data");
      return mockApi.getOrderById(orderId);
    }
  },

  getAll: async (token: string) => {
    if (useMockApi) {
      return mockApi.getAllOrders();
    }
    try {
      return await orderApi.getUserOrders(token);
    } catch (error) {
      console.warn("Order API failed, falling back to mock data");
      return mockApi.getAllOrders();
    }
  },

  updateStatus: async (orderId: string, status: string, token: string) => {
    if (useMockApi) {
      return mockApi.updateOrder(orderId, { status });
    }
    try {
      return await orderApi.updateOrderStatus(orderId, status, token);
    } catch (error) {
      console.warn("Order API failed, falling back to mock data");
      return mockApi.updateOrder(orderId, { status });
    }
  },
};

// Export a function to toggle between real API and mock API
export const setUseMockApi = (value: boolean) => {
  useMockApi = value;
};

// Cart API
export const cartAPI = {
  get: async () => {
    if (useMockApi) {
      return mockApi.getCart();
    }
    try {
      const token = localStorage.getItem('token') || '';
      return await api.get('/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.warn("Cart API failed, falling back to mock data");
      return mockApi.getCart();
    }
  },
  
  add: async (productId: number, quantity: number = 1) => {
    if (useMockApi) {
      return mockApi.addToCart(productId);
    }
    try {
      const token = localStorage.getItem('token') || '';
      return await api.post('/cart', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.warn("Cart API failed, falling back to mock data");
      return mockApi.addToCart(productId);
    }
  },
  
  update: async (itemId: string, quantity: number) => {
    if (useMockApi) {
      return mockApi.updateCartItem(itemId, quantity);
    }
    try {
      const token = localStorage.getItem('token') || '';
      return await api.put(`/cart/${itemId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.warn("Cart API failed, falling back to mock data");
      return mockApi.updateCartItem(itemId, quantity);
    }
  },
  
  remove: async (itemId: string) => {
    if (useMockApi) {
      return mockApi.removeFromCart(itemId);
    }
    try {
      const token = localStorage.getItem('token') || '';
      return await api.delete(`/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.warn("Cart API failed, falling back to mock data");
      return mockApi.removeFromCart(itemId);
    }
  },
  
  clear: async () => {
    if (useMockApi) {
      return mockApi.clearCart();
    }
    try {
      const token = localStorage.getItem('token') || '';
      return await api.delete('/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.warn("Cart API failed, falling back to mock data");
      return mockApi.clearCart();
    }
  },
};

// Export the current state
export const getUseMockApi = () => useMockApi;
