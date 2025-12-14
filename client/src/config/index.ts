
// Application configuration
export const config = {
  // API configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api/v1' : 'http://localhost:5000/api/v1'),
    timeout: 10000,
  },

  // App configuration
  app: {
    name: 'Online Store',
    version: '1.0.0',
    description: 'A modern e-commerce platform',
  },

  // Feature flags
  features: {
    enableDarkMode: true,
    enableWishlist: false,
    enableReviews: true,
    enableRecommendations: false,
  },

  // UI configuration
  ui: {
    itemsPerPage: 12,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
  },
};

export default config;
