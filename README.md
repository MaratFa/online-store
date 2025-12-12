# Online Store - React Application

A modern, responsive e-commerce platform built with React, TypeScript, and Redux Toolkit. This application showcases a clean design with intuitive user interface and comprehensive shopping functionality, featuring a robust API fallback mechanism for seamless operation even when backend is unavailable. The project has been optimized with consolidated data management and improved type safety.

## 🚀 Live Demo

View the live application at: https://online-store-free.vercel.app

## ✨ Features

- 🛍️ **Product Catalog**: Browse products with filtering, sorting, and search functionality
- 🛒 **Shopping Cart**: Add items to cart, adjust quantities, and view order summary with Redux state management
- 🔐 **User Authentication**: Register and login to access personalized features
- 📱 **Responsive Design**: Fully responsive layout that works on all devices
- 🏷️ **Product Categories**: Easy navigation through organized product categories
- 📋 **Product Details**: Detailed product pages with ratings, reviews, and specifications
- 💰 **Discount Pricing**: Clear display of original and discounted prices
- 🎨 **Modern UI**: Beautiful interface with smooth transitions and hover effects
- 🧩 **Component Architecture**: Well-organized, reusable UI components
- 🔄 **API Fallback System**: Automatic fallback to mock data when backend is unavailable
- 🚀 **Development Mode**: Seamless development experience with mock data by default
- 📊 **Consolidated Data Management**: Centralized product data with proper type safety

## 🛠️ Technologies Used

- React 18 with functional components and hooks
- TypeScript for type safety
- React Router for client-side routing
- Redux Toolkit for state management
- Axios for API communication with fallback mechanism
- CSS3 with custom properties for styling
- Font Awesome for icons
- Express.js for production server

## 📁 Project Structure

```
online-store/
├── public/                 # Static assets
│   ├── images/            # Product images and assets
│   └── index.html         # Main HTML file
├── src/                   # Source code
│   ├── components/        # Reusable components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   ├── shared/        # Shared UI components (Button, Modal, etc.)
│   │   ├── ui/           # UI components (Button, Input)
│   │   └── product/      # Product-specific components
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Home page
│   │   ├── Products.tsx   # Products listing page
│   │   ├── ProductDetail.tsx # Product detail page
│   │   ├── Cart.tsx       # Shopping cart page
│   │   ├── Account.tsx    # Account login/registration
│   │   ├── Dashboard.tsx  # User dashboard
│   │   └── Orders.tsx     # User orders page
│   ├── services/          # API services
│   │   ├── api/          # API service modules
│   │   ├── apiWithFallback.ts # API with fallback to mock data
│   │   └── mockApi.ts    # Mock API implementation
│   ├── store/             # Redux store configuration
│   │   ├── slices/        # Redux slices
│   │   │   ├── cartSlice.ts    # Cart state management
│   │   │   ├── productsSlice.ts # Products state management
│   │   │   ├── userSlice.ts    # User state management
│   │   │   └── ordersSlice.ts  # Orders state management
│   │   ├── thunks/       # Redux thunks
│   │   │   ├── authThunks.ts   # Authentication actions
│   │   │   ├── cartThunks.ts    # Cart actions
│   │   │   ├── productsThunks.ts # Products actions
│   │   │   └── orderThunks.ts  # Order actions
│   │   ├── hooks.ts      # Custom Redux hooks
│   │   └── index.ts      # Store configuration
│   ├── data/              # Data management
│   │   ├── mocks.ts       # Mock product data
│   │   ├── mappers.ts     # Data transformation functions
│   │   ├── transformers.ts # API response transformers
│   │   └── index.ts       # Data exports
│   ├── types/             # TypeScript type definitions
│   │   ├── product.ts     # Product-related types
│   │   ├── user.ts        # User-related types
│   │   ├── cart.ts        # Cart-related types
│   │   ├── order.ts       # Order-related types
│   │   └── index.ts       # Type exports
│   ├── App.tsx            # Main app component with routing
│   ├── App.css            # App styles
│   ├── index.tsx          # Entry point
│   └── index.css          # Global styles
├── serve.ts               # Production server
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/your-repo/online-store.git
   cd online-store
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 to view the application in your browser.

### Building for Production

To build the application for production:

```bash
npm run build
```

To serve the production build:

```bash
npm run serve
```

This will start the production server on port 3000 (or the port specified in the PORT environment variable).

## 🌐 Deployment

### Deploying to Vercel

The application is configured to be easily deployed to Vercel:

1. **Automatic Deployment**:
   - Connect your GitHub repository to Vercel
   - Push changes to trigger automatic deployments

2. **Manual Deployment**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and deploy
   vercel login
   vercel --prod
   ```

3. **Environment Variables**:
   - Set `REACT_APP_API_URL` in the Vercel dashboard if connecting to a real API
   - Currently configured to use mock data in production

### Important Note

The application currently uses mock data for all environments to ensure smooth operation without a backend API. This prevents connection errors when deployed to platforms like Vercel. If you want to connect to a real backend API, update the `apiWithFallback.ts` file and set the `REACT_APP_API_URL` environment variable.

## 📖 Usage

### Browsing Products

- Navigate to the Products page to view all available items
- Use the search bar to find specific products
- Filter products by category using the category buttons
- Sort products by price, rating, or featured status

### Product Information

Each product card displays:
- Product image
- Product name
- Category
- Rating and number of reviews
- Original price (if discounted)
- Discounted price (if applicable)
- Stock status
- "Add to Cart" button

### Shopping Cart

- View your cart by clicking the cart icon in the header
- Adjust quantities using the + and - buttons
- Remove items with the trash icon
- View the order summary with subtotal, tax, and total
- Proceed to checkout when ready

### User Account

- Create an account or log in through the Account page
- Access your dashboard after logging in
- View order history and saved information

## 🔄 Data Management

The application uses a centralized data management approach:

- **Mock Data**: All product data is centralized in `src/data/mocks.ts`
- **Type Safety**: Product interfaces are defined in `src/types/product.ts`
- **Data Transformation**: Mappers and transformers in `src/data/` handle data formatting
- **API Fallback**: Automatic fallback to mock data when the backend is unavailable

### Adding New Products

To add new products:

1. Open `src/data/mocks.ts`
2. Add a new product object to the `mockProducts` array with the following structure:
   ```typescript
   {
     id: number,              // Unique identifier
     name: string,            // Product name
     description: string,     // Product description
     price: number,           // Regular price
     discountPrice?: number,  // Optional discounted price
     image: string,           // Image path
     images?: string[],        // Optional additional images
     category: string,        // Product category
     stock: number,           // Available stock
     rating: number,          // Average rating (1-5)
     reviews: number,         // Number of reviews
     featured?: boolean,      // Optional featured flag
     tags?: string[]          // Optional tags for search
   }
   ```

3. Add the product image to the `public/images` directory

### Adding New Categories

To add new product categories:

1. Open `src/data/mocks.ts`
2. Add a new category to the `categories` array:
   ```typescript
   export const categories = [
     "All",
     "Electronics",
     "Clothing",
     // Add your new category here
   ];
   ```

## 🎨 Customization

### Creating New Components

To add new components:

1. Create a component file in the appropriate directory:
   - Layout components: `src/components/layout/`
   - Shared UI components: `src/components/shared/`
   - UI components: `src/components/ui/`
   - Product components: `src/components/product/`

2. Create the component with TypeScript:
   ```typescript
   import React from 'react';
   import './ComponentName.css';

   export const ComponentName: React.FC = () => {
     return (
       <div className="component-name">
         {/* Component content */}
       </div>
     );
   };
   ```

3. Create the corresponding CSS file

4. Export the component in the directory's index.ts file

### Styling

The application uses CSS with custom properties for consistent theming:

- Primary colors are defined in `src/styles/variables.css`
- Component-specific styles are in separate CSS files
- Responsive design uses media queries

### Adding New Pages

To add new pages:

1. Create a new component in `src/pages/`
2. Add a route in `src/routes/index.tsx`
3. Add navigation links in `src/components/layout/Header.tsx` if needed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

- Follow the existing code style and conventions
- Use TypeScript for all new code
- Ensure components are properly typed
- Write responsive CSS
- Test your changes before submitting

### Code Structure

- Use functional components with hooks
- Keep components focused on a single responsibility
- Use proper TypeScript typing for all props and state
- Follow the established directory structure

## 📄 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

Potential improvements for future versions:

- Real-time inventory management
- Advanced search with filters
- Customer reviews system
- Wishlist functionality
- Order tracking
- Payment gateway integration
- Product comparison feature
- Social login integration
- Multi-language support
- Advanced analytics dashboard
- Automated testing suite

## 🐛 Recent Updates

- Consolidated product data in centralized location (`src/data/mocks.ts`)
- Improved type safety by using a single Product interface from `src/types/product.ts`
- Fixed import paths to use direct references to data files
- Enhanced data management with proper separation of concerns
- Improved component organization with shared UI components

