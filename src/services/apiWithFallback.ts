import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Flag to determine if we should use mock API
// Initialize based on environment variable or default to true for development
let useMockApi =
  process.env.REACT_APP_USE_MOCK_API === "true" ||
  process.env.NODE_ENV === "development";

// Import mock API
import { mockApi } from "./mockApi";

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
      // Only log the warning if we're not already in mock mode
      if (!useMockApi) {
        console.warn("Backend not available, switching to mock API");
        useMockApi = true;
      }

      // Get the URL and method from the error config
      const url = error.config?.url || "";
      const method = error.config?.method?.toUpperCase() || "GET";
      const data = error.config?.data;

      // Get mock data based on the URL and method
      const mockData = await getMockDataForUrl(url, method, data);

      // Return a resolved promise with mock data
      return Promise.resolve({ data: mockData });
    }

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      window.location.href = "/account";
    }
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If we're using mock API, don't make the request
    if (useMockApi) {
      // Return a special error that will be caught by the response interceptor
      const error = new Error("Using mock API") as any;
      error.config = config;
      return Promise.reject(error);
    }

    const token = localStorage.getItem("token");
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

// Helper function to get mock data based on the URL
const getMockDataForUrl = async (url: string, method: string, data?: any) => {
  // Extract the endpoint from the URL
  const endpoint = url.replace(
    process.env.REACT_APP_API_URL || "http://localhost:5000/api",
    ""
  );

  // Handle different endpoints
  if (endpoint === "/products" || endpoint.startsWith("/products")) {
    if (method === "GET") {
      if (endpoint.includes("/search")) {
        const query = new URLSearchParams(url.split("?")[1]).get("q") || "";
        return mockApi.searchProducts(query);
      } else if (endpoint.includes("?category=")) {
        const category =
          new URLSearchParams(url.split("?")[1]).get("category") || "";
        return mockApi.getProductsByCategory(category);
      } else if (endpoint !== "/products" && endpoint.includes("/")) {
        const id = endpoint.split("/")[2];
        return mockApi.getProductById(parseInt(id));
      } else {
        return mockApi.getProducts();
      }
    }
  } else if (endpoint === "/auth/login" && method === "POST") {
    return mockApi.login(data.email, data.password);
  } else if (endpoint === "/auth/register" && method === "POST") {
    return mockApi.register(data);
  } else if (endpoint === "/auth/logout" && method === "POST") {
    return { success: true };
  } else if (endpoint === "/auth/me" && method === "GET") {
    return mockApi.getCurrentUser();
  } else if (endpoint === "/cart") {
    if (method === "GET") {
      return mockApi.getCart();
    } else if (method === "POST") {
      return mockApi.addToCart(data.productId);
    } else if (method === "DELETE") {
      return mockApi.clearCart();
    }
  } else if (endpoint.startsWith("/cart/") && method === "DELETE") {
    const itemId = endpoint.split("/")[2];
    return mockApi.removeFromCart(itemId);
  } else if (endpoint.startsWith("/cart/") && method === "PUT") {
    const itemId = endpoint.split("/")[2];
    return mockApi.updateCartItem(itemId, data.quantity);
  } else if (endpoint === "/orders" && method === "GET") {
    return mockApi.getAllOrders();
  } else if (endpoint.startsWith("/orders/") && method === "GET") {
    const id = endpoint.split("/")[2];
    return mockApi.getOrderById(id);
  } else if (endpoint === "/orders" && method === "POST") {
    return mockApi.createOrder(data);
  } else if (endpoint.startsWith("/orders/") && method === "PUT") {
    const id = endpoint.split("/")[2];
    return mockApi.updateOrder(id, data);
  }

  // Default fallback - return empty array for products endpoint
  if (endpoint === "/products") {
    return [];
  }
  return null;
};

// Type definitions for order responses
export interface OrderResponse {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
}

export const orderAPI = {
  getAll: async () => {
    if (useMockApi) {
      return callMockApi<OrderResponse[]>("/orders", "GET");
    }

    try {
      return await api.get<OrderResponse[]>("/orders");
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },

  getById: async (id: string) => {
    if (useMockApi) {
      return callMockApi<OrderResponse>(`/orders/${id}`, "GET");
    }

    try {
      return await api.get<OrderResponse>(`/orders/${id}`);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },

  create: async (orderData: any) => {
    if (useMockApi) {
      return callMockApi<OrderResponse>("/orders", "POST", orderData);
    }

    try {
      return await api.post<OrderResponse>("/orders", orderData);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },

  update: async (id: string, updateData: any) => {
    if (useMockApi) {
      return callMockApi<OrderResponse>(`/orders/${id}`, "PUT", updateData);
    }

    try {
      return await api.put<OrderResponse>(`/orders/${id}`, updateData);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
};

export const productAPI = {
  getAll: async () => {
    if (useMockApi) {
      return callMockApi("/products", "GET");
    }

    try {
      return await api.get("/products");
    } catch (error) {
      // The response interceptor will handle the fallback
      console.error("Product API: Error fetching products:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    if (useMockApi) {
      return callMockApi(`/products/${id}`, "GET");
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
      return callMockApi(`/products?category=${category}`, "GET");
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
      return callMockApi(`/products/search?q=${query}`, "GET");
    }

    try {
      return await api.get(`/products/search?q=${query}`);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
};

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    if (useMockApi) {
      return callMockApi<AuthResponse>("/auth/login", "POST", credentials);
    }

    try {
      return await api.post<AuthResponse>("/auth/login", credentials);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    if (useMockApi) {
      return callMockApi<AuthResponse>("/auth/register", "POST", userData);
    }

    try {
      return await api.post<AuthResponse>("/auth/register", userData);
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },

  logout: async () => {
    if (useMockApi) {
      return Promise.resolve({ data: { success: true } });
    }

    try {
      return await api.post("/auth/logout");
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },

  getCurrentUser: async () => {
    if (useMockApi) {
      return callMockApi<AuthResponse["user"]>("/auth/me", "GET");
    }

    try {
      return await api.get<AuthResponse["user"]>("/auth/me");
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
};

export const cartAPI = {
  get: async () => {
    if (useMockApi) {
      return callMockApi("/cart", "GET");
    }

    try {
      return await api.get("/cart");
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },

  add: async (productId: number) => {
    if (useMockApi) {
      return callMockApi("/cart", "POST", { productId });
    }

    try {
      return await api.post("/cart", { productId });
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },

  update: async (itemId: string, quantity: number) => {
    if (useMockApi) {
      return callMockApi(`/cart/${itemId}`, "PUT", { quantity });
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
      return callMockApi(`/cart/${itemId}`, "DELETE");
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
      return callMockApi("/cart", "DELETE");
    }

    try {
      return await api.delete("/cart");
    } catch (error) {
      // The response interceptor will handle the fallback
      throw error;
    }
  },
};
