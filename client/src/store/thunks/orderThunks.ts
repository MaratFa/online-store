import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/apiIntegration';

// Async thunks for order operations
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await orderAPI.getAll(token);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await orderAPI.getById(id, token);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await orderAPI.create(orderData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to create order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await orderAPI.updateStatus(id, 'cancelled', token);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to cancel order');
    }
  }
);
