import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../data';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
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
        state.items.push({ ...action.payload, quantity: 1 });
      }

      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      console.log('Cart updated. Total items:', state.totalItems);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.discountPrice || item.price) * item.quantity,
        0
      );
    },
    updateQuantity: (state, action: PayloadAction<{id: number, quantity: number}>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
        
        // Update totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        console.log('Cart updated. Total items:', state.totalItems);
        state.totalAmount = state.items.reduce(
          (total, item) => total + (item.discountPrice || item.price) * item.quantity,
          0
        );
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          existingItem.quantity -= 1;
        }

        // Update totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        console.log('Cart updated. Total items:', state.totalItems);
        state.totalAmount = state.items.reduce(
          (total, item) => total + (item.discountPrice || item.price) * item.quantity,
          0
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
