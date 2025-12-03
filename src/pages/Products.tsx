import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Products.css';
import { products as allProducts, categories, Product } from '../data';

export const Products: React.FC = () => {
  const [products] = useState<Product[]>(allProducts);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Products</h1>
          <div className="product-controls">
            <div className="filter-controls">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div className="filter-buttons">
                {categories.map(category => (
                  <button 
                    key={category} 
                    className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="sort-controls">
              <select className="sort-select">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="products-grid">
          {products
            .filter(product => 
              (activeCategory === 'All' || product.category === activeCategory) &&
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(Math.floor(product.rating))].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                      {product.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                    </div>
                    <span className="rating-value">({product.reviews})</span>
                  </div>
                  <div className="product-price">
                    {product.discountPrice ? (
                      <>
                        <span className="original-price">${product.price}</span>
                        <span className="current-price">${product.discountPrice}</span>
                      </>
                    ) : (
                      <span className="current-price">${product.price}</span>
                    )}
                  </div>
                </div>
              </Link>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
