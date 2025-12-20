import { mockProducts as products } from "../data/mocks";
import { Product } from "../types";

// Type definitions
interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
    avatar?: string;
  };
  token: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

// Mock API responses
export const mockApi = {
  // Get all products
  getProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products);
      }, 500); // Simulate network delay
    });
  },

  // Get product by ID
  getProductById: (id: number) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = products.find((p: Product) => p.id === id);
        if (product) {
          resolve(product);
        } else {
          reject(new Error("Product not found"));
        }
      }, 500);
    });
  },

  // Get products by category
  getProductsByCategory: (category: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (category === "All") {
          resolve(products);
        } else {
          resolve(products.filter((p: Product) => p.category === category));
        }
      }, 500);
    });
  },

  // Search products
  searchProducts: (query: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = products.filter((p: Product) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 500);
    });
  },

  // Cart operations (mock)
  getCart: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: [],
          totalAmount: 0,
          totalItems: 0,
        });
      }, 500);
    });
  },

  addToCart: (productId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: [],
          totalAmount: 0,
          totalItems: 0,
        });
      }, 500);
    });
  },

  removeFromCart: (itemId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: [],
          totalAmount: 0,
          totalItems: 0,
        });
      }, 500);
    });
  },

  updateCartItem: (itemId: string, quantity: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: [],
          totalAmount: 0,
          totalItems: 0,
        });
      }, 500);
    });
  },

  clearCart: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          items: [],
          totalAmount: 0,
          totalItems: 0,
        });
      }, 500);
    });
  },

  // User operations (mock)
  login: (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple mock authentication
        if (email === "user@example.com" && password === "user123") {
          resolve({
            user: {
              id: "1",
              email: "user@example.com",
              name: "John Doe",
              role: "user",
            },
            token: "mock-jwt-token",
          });
        } else if (email === "admin@example.com" && password === "admin123") {
          resolve({
            user: {
              id: "2",
              email: "admin@example.com",
              name: "Admin User",
              role: "admin",
            },
            token: "mock-admin-jwt-token",
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  },

  register: (userData: { name: string; email: string; password: string }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple mock registration
        if (userData.email && userData.password) {
          resolve({
            user: {
              id: "2",
              email: userData.email,
              name: userData.name,
            },
            token: "mock-jwt-token",
          });
        } else {
          reject(new Error("Invalid registration data"));
        }
      }, 500);
    });
  },

  logout: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },

  getCurrentUser: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "1",
          email: "user@example.com",
          name: "John Doe",
          role: "user",
        });
      }, 500);
    });
  },

  // Order operations (mock)
  getAllOrders: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "ORD001",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "delivered",
            items: [
              {
                id: "1",
                name: "Wireless Bluetooth Headphones",
                price: 59.99,
                quantity: 1,
                image: "/images/headphones.jpg",
              },
            ],
            total: 59.99,
            shippingAddress: {
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "USA",
            },
            paymentMethod: "Credit Card",
          },
          {
            id: "ORD002",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: "shipped",
            items: [
              {
                id: "2",
                name: "Smart Watch",
                price: 199.99,
                quantity: 1,
                image: "/images/smartwatch.jpg",
              },
              {
                id: "3",
                name: "Phone Case",
                price: 14.99,
                quantity: 2,
                image: "/images/charger.jpg",
              },
            ],
            total: 229.97,
            shippingAddress: {
              street: "456 Oak Ave",
              city: "Los Angeles",
              state: "CA",
              zipCode: "90001",
              country: "USA",
            },
            paymentMethod: "PayPal",
          },
          {
            id: "ORD003",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: "processing",
            items: [
              {
                id: "4",
                name: "Laptop Stand",
                price: 39.99,
                quantity: 1,
                image: "/images/laptop-bag.jpg",
              },
            ],
            total: 39.99,
            shippingAddress: {
              street: "789 Pine St",
              city: "Chicago",
              state: "IL",
              zipCode: "60007",
              country: "USA",
            },
            paymentMethod: "Credit Card",
          },
        ]);
      }, 500);
    });
  },

  getOrderById: (id: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock order data
        const orders = [
          {
            id: "ORD001",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "delivered",
            items: [
              {
                id: "1",
                name: "Wireless Bluetooth Headphones",
                price: 59.99,
                quantity: 1,
                image: "/images/headphones.jpg",
              },
            ],
            total: 59.99,
            shippingAddress: {
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "USA",
            },
            paymentMethod: "Credit Card",
          },
          {
            id: "ORD002",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: "shipped",
            items: [
              {
                id: "2",
                name: "Smart Watch",
                price: 199.99,
                quantity: 1,
                image: "/images/smartwatch.jpg",
              },
              {
                id: "3",
                name: "Phone Case",
                price: 14.99,
                quantity: 2,
                image: "/images/charger.jpg",
              },
            ],
            total: 229.97,
            shippingAddress: {
              street: "456 Oak Ave",
              city: "Los Angeles",
              state: "CA",
              zipCode: "90001",
              country: "USA",
            },
            paymentMethod: "PayPal",
          },
          {
            id: "ORD003",
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: "processing",
            items: [
              {
                id: "4",
                name: "Laptop Stand",
                price: 39.99,
                quantity: 1,
                image: "/images/laptop-bag.jpg",
              },
            ],
            total: 39.99,
            shippingAddress: {
              street: "789 Pine St",
              city: "Chicago",
              state: "IL",
              zipCode: "60007",
              country: "USA",
            },
            paymentMethod: "Credit Card",
          },
        ];

        const order = orders.find((o) => o.id === id);

        if (order) {
          resolve(order);
        } else {
          reject(new Error("Order not found"));
        }
      }, 500);
    });
  },

  createOrder: (orderData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder = {
          id: `ORD${Math.floor(Math.random() * 1000)}`,
          date: new Date().toISOString(),
          status: "pending",
          items: orderData.items,
          total: orderData.total,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
        };
        resolve(newOrder);
      }, 500);
    });
  },

  updateOrder: (id: string, updateData: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In a real implementation, this would update the order in the database
        // For mock purposes, we'll just return the updated order
        const updatedOrder = {
          id,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: updateData.status || "processing",
          items: [
            {
              id: "4",
              name: "Laptop Stand",
              price: 39.99,
              quantity: 1,
              image: "/images/laptop-bag.jpg",
            },
          ],
          total: 39.99,
          shippingAddress: {
            street: "789 Pine St",
            city: "Chicago",
            state: "IL",
            zipCode: "60007",
            country: "USA",
          },
          paymentMethod: "Credit Card",
        };
        resolve(updatedOrder);
      }, 500);
    });
  },
};
