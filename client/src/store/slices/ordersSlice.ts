import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { fetchOrders, getOrderById, createOrder, cancelOrder } from '../thunks/orderThunks';

// Define the Order type
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
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

// Create entity adapter for orders
const ordersAdapter = createEntityAdapter<Order>({
  selectId: (order) => order.id,
  sortComparer: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(), // Sort by date descending
});

// Define the initial state
const initialState = ordersAdapter.getInitialState({
  loading: false,
  error: null as string | null,
  currentOrder: null as Order | null,
});

// Create the slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        ordersAdapter.setAll(state, action.payload || []);
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get order by ID
    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload || null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        ordersAdapter.addOne(state, action.payload || {});
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        ordersAdapter.updateOne(state, {
          id: action.payload?.id || "",
          changes: { status: 'cancelled' },
        });
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearCurrentOrder } = ordersSlice.actions;

// Export selectors
export const {
  selectAll: selectAllOrders,
  selectById: selectOrderById,
  selectIds: selectOrderIds,
} = ordersAdapter.getSelectors((state: any) => state.orders);

// Export the reducer
export default ordersSlice.reducer;
