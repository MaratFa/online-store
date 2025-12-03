import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../data';

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
  sortBy: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  categories: [],
  selectedCategory: 'All',
  searchTerm: '',
  sortBy: 'featured',
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    filterByCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;

      if (action.payload === 'All') {
        state.filteredProducts = state.products;
      } else {
        state.filteredProducts = state.products.filter(
          product => product.category === action.payload
        );
      }

      // Apply search filter if exists
      if (state.searchTerm) {
        state.filteredProducts = state.filteredProducts.filter(product =>
          product.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      applySorting(state);
    },
    searchProducts: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;

      // Start with all products or category-filtered products
      let productsToFilter = state.selectedCategory === 'All' 
        ? state.products 
        : state.products.filter(product => product.category === state.selectedCategory);

      // Apply search filter
      if (action.payload) {
        state.filteredProducts = productsToFilter.filter(product =>
          product.name.toLowerCase().includes(action.payload.toLowerCase())
        );
      } else {
        state.filteredProducts = productsToFilter;
      }

      // Apply sorting
      applySorting(state);
    },
    sortProducts: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      applySorting(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Helper function to apply sorting
const applySorting = (state: ProductsState) => {
  switch (state.sortBy) {
    case 'price-low-high':
      state.filteredProducts.sort((a, b) => 
        (a.discountPrice || a.price) - (b.discountPrice || b.price)
      );
      break;
    case 'price-high-low':
      state.filteredProducts.sort((a, b) => 
        (b.discountPrice || b.price) - (a.discountPrice || a.price)
      );
      break;
    case 'rating':
      state.filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      // Keep original order for featured
      break;
  }
};

export const {
  setProducts,
  setCategories,
  filterByCategory,
  searchProducts,
  sortProducts,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
