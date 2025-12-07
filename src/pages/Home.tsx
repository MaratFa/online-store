import React from "react";
import { Link } from "react-router-dom";
import { mockProducts as products } from "../data/mocks";
import { Product } from "../types";
import { ProductCard } from "../components";
import "./Home.css";

export const Home: React.FC = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at great prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {products.slice(0, 4).map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
