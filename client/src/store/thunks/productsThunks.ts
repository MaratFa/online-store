import { createAsyncThunk } from "@reduxjs/toolkit";
import { productAPI } from "../../services/apiIntegration";

// Async thunks for product-related operations
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ filter, page }: { filter?: any; page?: number }, { rejectWithValue }) => {
    try {
      const response = await productAPI.getAll();

      // Ensure we always return a valid array
      if (!response || !response.data) {
        console.warn("Thunk: No data in response, returning empty array");
        return [];
      }

      // Handle nested data structure from API
      // The API returns { success: true, count: number, data: products }
      // We need to extract the actual products array
      const products = response.data.data || response.data;

      if (!Array.isArray(products)) {
        console.warn("Thunk: Response data is not an array, returning empty array");
        return [];
      }

      return products;
    } catch (error) {
      console.error("Thunk: Error fetching products", error);
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await productAPI.getById(id);
      // Handle nested data structure from API
      return response?.data?.data || response?.data || null;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await productAPI.getByCategory(category);
      // Handle nested data structure from API
      const products = response?.data?.data || response?.data || [];
      return Array.isArray(products) ? products : [];
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message ||
          "Failed to fetch products by category"
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await productAPI.search(query);
      // Handle nested data structure from API
      const products = response?.data?.data || response?.data || [];
      return Array.isArray(products) ? products : [];
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || "Failed to search products"
      );
    }
  }
);
