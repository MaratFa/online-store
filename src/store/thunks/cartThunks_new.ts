import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/apiIntegration';

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.get();
      return (response as any).data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to fetch cart');
    }
  },
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.add(productId, quantity);
      return (response as any).data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to add item to cart');
    }
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.update(itemId, quantity);
      return (response as any).data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to update cart item');
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await cartAPI.remove(itemId);
      return itemId; // Return the ID of the removed item
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to remove item from cart');
    }
  },
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clear();
      return true;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || 'Failed to clear cart');
    }
  },
);