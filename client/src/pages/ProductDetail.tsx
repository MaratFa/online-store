import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts as products } from '../data/mocks';
import { Product } from '../types';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import './ProductDetail.css';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const dispatch = useAppDispatch();

  // Find the product by ID
  const product = products.find((p: Product) => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    // Add product to cart
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    return stars;
  };

  return (
    <div className="product-detail">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to="/products">Products</Link>
          <span className="separator">/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-container">
          <div className="product-image-container">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              {/* In a real app, these would be additional product images */}
              <img src={product.image} alt={product.name} className="active" />
              <img src={product.image} alt={product.name} />
              <img src={product.image} alt={product.name} />
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          <div className="product-info-container">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <div className="stars">
                {renderStars(product.rating)}
              </div>
              <span className="rating-value">{product.rating}</span>
              <span className="review-count">({product.reviews} reviews)</span>
            </div>

            <div className="product-price">
              {product.discountPrice ? (
                <>
                  <span className="original-price">${product.price}</span>
                  <span className="current-price">${product.discountPrice}</span>
                  <span className="discount-badge">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="current-price">${product.price}</span>
              )}
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Availability:</span>
                <span className={`meta-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <select 
                  id="quantity" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  disabled={product.stock === 0}
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button className="wishlist-btn">
                <i className="far fa-heart"></i>
                Add to Wishlist
              </button>
            </div>

            <div className="product-features">
              <div className="feature">
                <i className="fas fa-shipping-fast"></i>
                <span>Free Shipping</span>
              </div>
              <div className="feature">
                <i className="fas fa-undo"></i>
                <span>30-Day Returns</span>
              </div>
              <div className="feature">
                <i className="fas fa-shield-alt"></i>
                <span>1-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        <div className="product-tabs">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane active">
                <div className="product-description">
                  <h3>Product Description</h3>
                  <p>{product.description}</p>

                  <h3>Key Features</h3>
                  <ul>
                    <li>Premium quality materials</li>
                    <li>Designed for durability and comfort</li>
                    <li>Backed by manufacturer warranty</li>
                    <li>Customer satisfaction guaranteed</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane active">
                <div className="product-reviews">
                  <h3>Customer Reviews</h3>

                  {/* Sample review - in a real app, this would come from an API */}
                  <div className="review">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">JD</div>
                        <div>
                          <div className="reviewer-name">John Doe</div>
                          <div className="review-date">October 15, 2023</div>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(5)}
                      </div>
                    </div>
                    <div className="review-content">
                      <p>Great product! Exactly as described and arrived quickly. Highly recommend.</p>
                    </div>
                  </div>

                  <div className="review">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">AS</div>
                        <div>
                          <div className="reviewer-name">Alice Smith</div>
                          <div className="review-date">September 28, 2023</div>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(4)}
                      </div>
                    </div>
                    <div className="review-content">
                      <p>Good quality product. The only issue was that the shipping took a bit longer than expected.</p>
                    </div>
                  </div>

                  <button className="load-more-reviews">Load More Reviews</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="related-products">
          <h3>Related Products</h3>
          <div className="products-grid">
            {/* In a real app, these would be related products from the same category */}
            {products
              .filter((p: Product) => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct: Product) => (
                <div key={relatedProduct.id} className="product-card">
                  <div className="product-image">
                    <img src={relatedProduct.image} alt={relatedProduct.name} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{relatedProduct.name}</h3>
                    <div className="product-price">
                      {relatedProduct.discountPrice ? (
                        <>
                          <span className="original-price">${relatedProduct.price}</span>
                          <span className="current-price">${relatedProduct.discountPrice}</span>
                        </>
                      ) : (
                        <span className="current-price">${relatedProduct.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
