# Online Store

A full-stack e-commerce application built with React, Node.js, and PostgreSQL.

## Project Structure

This is a monorepo with separate client and server directories:

- `client/` - React frontend application
- `server/` - Node.js/Express backend API

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/MaratFa/online-store.git
   cd online-store
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your database credentials and other settings

4. Set up the database:
   ```
   cd server
   node scripts/setup-db.js
   node scripts/seed-db.js
   cd ..
   ```

5. Start the development servers:
   ```
   npm run dev
   ```

   This will start both the client (on port 3000) and server (on port 5000) concurrently.

## Deployment

This application is configured to deploy on Vercel. The `vercel.json` file contains the necessary configuration for deployment.

When deploying to Vercel, make sure to set the following environment variables in your Vercel dashboard:
- PG_HOST
- PG_PORT
- PG_USER
- PG_PASSWORD
- PG_DB
- JWT_SECRET
- NODE_ENV

## API Endpoints

The API provides the following endpoints:
- Authentication: `/api/v1/auth`
- Users: `/api/v1/users`
- Products: `/api/v1/products`
- Categories: `/api/v1/categories`
- Cart: `/api/v1/cart`
- Orders: `/api/v1/orders`
