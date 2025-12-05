import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  filterByCategory,
  searchProducts,
  sortProducts,
} from "../store/slices/productsSlice";
import { addToCart } from "../store/slices/cartSlice";
import { Product } from "../data";
import { fetchProducts } from "../store/thunks";
import { RatingStars } from "../components/ui/RatingStars";
import { ProductPrice } from "../components/ui/ProductPrice";
import "./Products.css";

// Component for pagination
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

// Component for quick view modal
const QuickViewModal: React.FC<{
  product: Product | null;
  onClose: () => void;
}> = ({ product, onClose }) => {
  const dispatch = useAppDispatch();

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    onClose();
  };

  return (
    <div className="quick-view-modal" onClick={onClose}>
      <div className="quick-view-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <div className="quick-view-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="quick-view-details">
          <h3>{product.name}</h3>
          <RatingStars rating={product.rating} reviews={product.reviews} />
          <ProductPrice product={product} />
          <div className="product-description">{product.description}</div>
          <div className="quick-view-actions">
            <Link to={`/product/${product.id}`} className="view-details-btn">
              View Details
            </Link>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for product card
const ProductCard: React.FC<{
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCompare: (id: number) => void;
  isInCompareList: boolean;
}> = ({ product, onQuickView, onAddToCompare, isInCompareList }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const discountPercentage = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-actions">
        <button
          className={`compare-checkbox ${isInCompareList ? "active" : ""}`}
          onClick={() => onAddToCompare(product.id)}
          title="Add to compare"
        >
          <i className="fas fa-balance-scale"></i>
        </button>
        <button
          className="quick-view-btn"
          onClick={() => onQuickView(product)}
          title="Quick view"
        >
          <i className="fas fa-eye"></i>
        </button>
      </div>
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          {product.discountPrice && (
            <div className="discount-badge">-{discountPercentage}%</div>
          )}
        </div>
        <div className="product-info">
          <div className="product-category">{product.category}</div>
          <h3 className="product-title">{product.name}</h3>
          <RatingStars rating={product.rating} reviews={product.reviews} />
          <ProductPrice product={product} />
        </div>
      </Link>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    filteredProducts,
    categories,
    selectedCategory,
    searchTerm,
    sortBy,
    loading,
    error,
  } = useAppSelector((state) => state.products);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // State for price range filter
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [ratingFilter, setRatingFilter] = useState(0);

  // State for product comparison
  const [compareList, setCompareList] = useState<number[]>([]);

  // State for quick view modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  // State for recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle price range change
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: Number(value) }));
  };

  // Handle rating filter change
  const handleRatingFilterChange = (rating: number) => {
    setRatingFilter(rating);
  };

  // Add to compare list
  const handleAddToCompare = (productId: number) => {
    if (compareList.includes(productId)) {
      setCompareList((prev) => prev.filter((id) => id !== productId));
    } else if (compareList.length < 3) {
      setCompareList((prev) => [...prev, productId]);
    } else {
      alert("You can compare up to 3 products at a time");
    }
  };

  // Handle quick view
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    // Add to recently viewed
    if (!recentlyViewed.find((p) => p.id === product.id)) {
      setRecentlyViewed((prev) => [product, ...prev.slice(0, 3)]);
    }
  };

  // Apply price and rating filters
  const filteredAndSortedProducts = currentProducts.filter((product) => {
    const productPrice = product.discountPrice || product.price;
    const matchesPrice =
      productPrice >= priceRange.min && productPrice <= priceRange.max;
    const matchesRating = product.rating >= ratingFilter;
    return matchesPrice && matchesRating;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i>
            <p>Error: {error}</p>
            <button onClick={() => dispatch(fetchProducts())} className="btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${
                      selectedCategory === category ? "active" : ""
                    }`}
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

        {/* Advanced Filters */}
        <div className="advanced-filters">
          <h3>Advanced Filters</h3>
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-range">
              <div className="range-input">
                <label>Min: ${priceRange.min}</label>
                <input
                  type="range"
                  name="min"
                  min="0"
                  max="1000"
                  value={priceRange.min}
                  onChange={handlePriceRangeChange}
                />
              </div>
              <div className="range-input">
                <label>Max: ${priceRange.max}</label>
                <input
                  type="range"
                  name="max"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={handlePriceRangeChange}
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h4>Minimum Rating</h4>
            <div className="rating-filter">
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className={`rating-btn ${
                    ratingFilter === rating ? "active" : ""
                  }`}
                  onClick={() => handleRatingFilterChange(rating)}
                >
                  {rating === 0 ? (
                    "All"
                  ) : (
                    <>
                      {rating} <i className="fas fa-star"></i>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Compare button - only show if products are selected for comparison */}
          {compareList.length > 0 && (
            <div className="compare-section">
              <button
                className="compare-btn"
                disabled={compareList.length < 2}
                onClick={() =>
                  alert("Compare functionality would be implemented here")
                }
              >
                Compare ({compareList.length}/3)
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleQuickView}
              onAddToCompare={handleAddToCompare}
              isInCompareList={compareList.includes(product.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div className="recently-viewed">
            <h3>Recently Viewed</h3>
            <div className="recently-viewed-grid">
              {recentlyViewed.map((product) => (
                <div key={product.id} className="recently-viewed-card">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <ProductPrice product={product} />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
