
// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  USER: '/user',
  AUTH: '/auth',
  ORDERS: '/orders',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
} as const;

// Categories
export const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Accessories',
  'Home',
] as const;

// Status messages
export const STATUS_MESSAGES = {
  LOADING: 'Loading...',
  ERROR: 'Something went wrong. Please try again.',
  SUCCESS: 'Success!',
  EMPTY_CART: 'Your cart is empty',
  NO_PRODUCTS: 'No products found',
  LOGIN_REQUIRED: 'Please login to continue',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  INITIAL_PAGE: 1,
} as const;
