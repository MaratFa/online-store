
// Mock data for development and testing
import { Product, User, Cart, Order } from '../types';

// Mock products
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and superior sound quality. Perfect for music lovers and professionals.",
    price: 199.99,
    discountPrice: 149.99,
    image: "/images/headphones.jpg",
    category: "Electronics",
    stock: 15,
    rating: 4.5,
    reviews: 128,
    featured: true,
    tags: ["audio", "wireless", "noise-cancelling", "premium"]
  },
  {
    id: 2,
    name: "Leather Laptop Bag",
    description: "Stylish and durable leather laptop bag designed for professionals. Fits laptops up to 15 inches with additional compartments.",
    price: 89.99,
    discountPrice: 69.99,
    image: "/images/laptop-bag.jpg",
    category: "Accessories",
    stock: 25,
    rating: 4.3,
    reviews: 86,
    featured: true,
    tags: ["leather", "professional", "laptop"]
  },
  {
    id: 3,
    name: "Smart Watch",
    description: "Advanced smartwatch with health monitoring, GPS tracking, and smartphone integration. Water-resistant design with long battery life.",
    price: 249.99,
    discountPrice: 199.99,
    image: "/images/smartwatch.jpg",
    category: "Electronics",
    stock: 12,
    rating: 4.7,
    reviews: 215,
    featured: true,
    tags: ["smart", "wearable", "health", "gps"]
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors. Ethically produced with fair trade certification.",
    price: 29.99,
    discountPrice: 24.99,
    image: "/images/tshirt.jpg",
    category: "Clothing",
    stock: 50,
    rating: 4.2,
    reviews: 67,
    featured: false,
    tags: ["organic", "cotton", "sustainable", "ethical"]
  },
  {
    id: 5,
    name: "Stainless Steel Water Bottle",
    description: "Eco-friendly insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free with lifetime warranty.",
    price: 34.99,
    discountPrice: 29.99,
    image: "/images/water-bottle.jpg",
    category: "Accessories",
    stock: 100,
    rating: 4.6,
    reviews: 342,
    featured: true,
    tags: ["eco-friendly", "insulated", "bpa-free"]
  },
  {
    id: 6,
    name: "Yoga Mat",
    description: "Non-slip, eco-friendly yoga mat with extra cushioning for joint support. Includes carrying strap and alignment markers.",
    price: 49.99,
    discountPrice: 39.99,
    image: "/images/yoga-mat.jpg",
    category: "Fitness",
    stock: 30,
    rating: 4.4,
    reviews: 156,
    featured: false,
    tags: ["non-slip", "eco-friendly", "exercise"]
  },
  {
    id: 7,
    name: "Standing Desk Converter",
    description: "Adjustable height desk converter that transforms any regular desk into a standing desk. Spacious work surface with smooth transition.",
    price: 299.99,
    discountPrice: 249.99,
    image: "/images/standing-desk.jpg",
    category: "Furniture",
    stock: 8,
    rating: 4.5,
    reviews: 93,
    featured: true,
    tags: ["ergonomic", "adjustable", "workspace"]
  },
  {
    id: 8,
    name: "Ergonomic Office Chair",
    description: "Comfortable office chair with lumbar support, adjustable armrests, and breathable mesh back. Designed for all-day comfort.",
    price: 399.99,
    discountPrice: 349.99,
    image: "/images/office-chair.jpg",
    category: "Furniture",
    stock: 5,
    rating: 4.6,
    reviews: 127,
    featured: true,
    tags: ["ergonomic", "comfortable", "office"]
  },
  {
    id: 9,
    name: "Denim Jacket",
    description: "Classic denim jacket with modern fit and sustainable production. Features multiple pockets and adjustable waist.",
    price: 79.99,
    discountPrice: 64.99,
    image: "/images/denim-jacket.jpg",
    category: "Clothing",
    stock: 20,
    rating: 4.3,
    reviews: 84,
    featured: false,
    tags: ["denim", "classic", "sustainable"]
  },
  {
    id: 10,
    name: "Camera Lens Kit",
    description: "Professional camera lens kit with multiple focal lengths. Compatible with most DSLR and mirrorless cameras.",
    price: 599.99,
    discountPrice: 499.99,
    image: "/images/camera-lens.jpg",
    category: "Electronics",
    stock: 3,
    rating: 4.8,
    reviews: 42,
    featured: true,
    tags: ["professional", "photography", "dslr", "mirrorless"]
  },
  {
    id: 11,
    name: "Sunglasses",
    description: "UV-protective polarized sunglasses with lightweight frame and scratch-resistant lenses. Includes protective case.",
    price: 59.99,
    discountPrice: 49.99,
    image: "/images/sunglasses.jpg",
    category: "Accessories",
    stock: 40,
    rating: 4.4,
    reviews: 178,
    featured: false,
    tags: ["uv-protection", "polarized", "lightweight"]
  },
  {
    id: 12,
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe, adjustable strength settings, and automatic shut-off. Makes up to 12 cups.",
    price: 129.99,
    discountPrice: 99.99,
    image: "/images/coffee-maker.jpg",
    category: "Home",
    stock: 15,
    rating: 4.5,
    reviews: 267,
    featured: false,
    tags: ["programmable", "thermal", "automatic"]
  },
  {
    id: 13,
    name: "Phone Charger",
    description: "Fast-charging wall adapter with multiple USB ports and universal compatibility. Includes safety features and compact design.",
    price: 29.99,
    discountPrice: 19.99,
    image: "/images/charger.jpg",
    category: "Electronics",
    stock: 75,
    rating: 4.2,
    reviews: 312,
    featured: false,
    tags: ["fast-charging", "usb", "universal"]
  },
  {
    id: 14,
    name: "Smart Home Hub",
    description: "Central control hub for all your smart home devices. Compatible with major brands and voice assistants.",
    price: 149.99,
    discountPrice: 119.99,
    image: "/images/smart-hub.jpg",
    category: "Electronics",
    stock: 10,
    rating: 4.3,
    reviews: 96,
    featured: false,
    tags: ["smart-home", "voice-control", "hub"]
  },
  {
    id: 15,
    name: "Backpack",
    description: "Durable backpack with laptop compartment, water bottle holder, and multiple organizational pockets. Comfortable padded straps.",
    price: 79.99,
    discountPrice: 64.99,
    image: "/images/backpack.jpg",
    category: "Accessories",
    stock: 25,
    rating: 4.5,
    reviews: 189,
    featured: false,
    tags: ["durable", "laptop", "organization"]
  }
];

// Mock users
export const mockUser: User = {
  id: 1,
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: '/images/avatar.jpg',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mock cart
export const mockCart: Cart = {
  id: 1,
  userId: 1,
  items: [
    {
      id: 1,
      productId: 1,
      product: mockProducts[0],
      quantity: 1,
      addedAt: new Date().toISOString()
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Categories
export const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Accessories",
  "Furniture",
  "Fitness",
  "Home"
];

// Mock orders
export const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Wireless Headphones',
        productImage: '/images/headphones.jpg',
        price: 99.99,
        discountPrice: 79.99,
        quantity: 1
      }
    ],
    status: 'delivered',
    subtotal: 99.99,
    tax: 8.00,
    shipping: 5.00,
    discount: 20.00,
    total: 92.99,
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    shippedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    deliveredAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
  // Add more mock orders as needed
];
