
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  images?: string[];
  category: string | Category;  // Can be either a string or a Category object
  Category?: Category;         // Nested category object from API
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  tags?: string[];
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'price' | 'rating' | 'name' | 'reviews';
  direction: 'asc' | 'desc';
}

// PaginatedResponse is imported from api.ts
