import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  filterByCategory,
  searchProducts,
  sortProducts
} from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../data';
import './Products.css';

export const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    filteredProducts,
    categories,
    selectedCategory,
    searchTerm,
    sortBy
  } = useAppSelector(state => state.products);

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
                  onChange={(e) => dispatch(searchProducts(e.target.value))}
                />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div className="filter-buttons">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => dispatch(filterByCategory(category))}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="sort-controls">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => dispatch(sortProducts(e.target.value))}
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
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
              <button className="add-to-cart-btn" onClick={() => {
                console.log('Adding to cart:', product);
                dispatch(addToCart(product));
              }}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
