import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import { fetchCart, addToCart as addToCartApi, updateCartItem, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from '../thunks';

interface CartItem extends Product {
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
      }

      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.discountPrice || item.price) * item.quantity,
        0
      );
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item) {
        item.quantity = quantity;
      }

      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.discountPrice || item.price) * item.quantity,
        0
      );
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);

      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.discountPrice || item.price) * item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
  extraReducers: (builder: any) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchCart.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add to cart
    builder
      .addCase(addToCartApi.fulfilled, (state: any, action: any) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(addToCartApi.rejected, (state: any, action: any) => {
        state.error = action.payload as string;
      });

    // Update cart item
    builder
      .addCase(updateCartItem.fulfilled, (state: any, action: any) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(updateCartItem.rejected, (state: any, action: any) => {
        state.error = action.payload as string;
      });

    // Remove from cart
    builder
      .addCase(removeFromCartApi.fulfilled, (state: any, action: any) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(removeFromCartApi.rejected, (state: any, action: any) => {
        state.error = action.payload as string;
      });

    // Clear cart
    builder
      .addCase(clearCartApi.fulfilled, (state: any) => {
        state.items = [];
        state.totalAmount = 0;
        state.totalItems = 0;
      })
      .addCase(clearCartApi.rejected, (state: any, action: any) => {
        state.error = action.payload as string;
      });
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
