
import { Product } from '../types/product';
import { User } from '../types/user';
import { CartItem } from '../types/cart';
import { Order } from '../types/order';

// Data transformation functions
export const mapProductData = (product: any): Product => {
  // Ensure product has required fields
  return {
    id: product.id || 0,
    name: product.name || '',
    description: product.description || '',
    price: product.price || 0,
    discountPrice: product.discountPrice,
    image: product.image || '',
    images: product.images || [product.image],
    category: product.category || '',
    stock: product.stock || 0,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    featured: product.featured || false,
    tags: product.tags || []
  };
};

export const mapUserData = (user: any): User => {
  // Ensure user has required fields
  return {
    id: user.id || 0,
    firstName: user.firstName || user.name?.split(' ')[0] || '',
    lastName: user.lastName || user.name?.split(' ')[1] || '',
    email: user.email || '',
    avatar: user.avatar || '',
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString()
  };
};

export const mapCartItemData = (item: any): CartItem => {
  // Ensure cart item has required fields
  return {
    id: item.id || 0,
    productId: item.productId || 0,
    product: item.product || {
      id: item.productId || 0,
      name: item.name || '',
      image: item.image || '',
      price: item.price || 0,
      discountPrice: item.discountPrice
    },
    quantity: item.quantity || 1,
    addedAt: item.addedAt || new Date().toISOString()
  };
};

export const mapOrderData = (order: any): Order => {
  // Ensure order has required fields
  return {
    id: order.id || 0,
    userId: order.userId || 0,
    items: order.items?.map((item: any) => ({
      id: item.id || 0,
      productId: item.productId || 0,
      productName: item.name || item.productName || '',
      productImage: item.image || item.productImage || '',
      price: item.price || 0,
      discountPrice: item.discountPrice,
      quantity: item.quantity || 1
    })) || [],
    status: order.status || 'pending',
    subtotal: order.subtotal || 0,
    tax: order.tax || 0,
    shipping: order.shipping || 0,
    discount: order.discount || 0,
    total: order.total || 0,
    shippingAddress: order.shippingAddress || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: order.paymentMethod || '',
    createdAt: order.createdAt || order.date || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString()
  };
};
