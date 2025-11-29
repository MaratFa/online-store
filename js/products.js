// Products functionality for the Free Online Store Template
// DOM elements
let productsContainer;
let filterButtons;
let searchInput;
let sortSelect;

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('products.html')) {
    initProductsPage();
  }
});

function initProductsPage() {
  productsContainer = document.querySelector('.products-container');

  // Create filter controls if they don't exist
  if (!document.querySelector('.products-header')) {
    const header = document.querySelector('.products-header');
    if (header) {
      header.innerHTML += `
        <div class="product-controls">
          <div class="filter-controls">
            <div class="search-box">
              <input type="text" class="search-input" placeholder="Search products...">
              <button class="search-btn"><i class="fas fa-search"></i></button>
            </div>

            <div class="filter-buttons">
              ${categories.map(cat => `
                <button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat === 'All' ? 'all' : cat}">
                  ${cat}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="sort-controls">
            <select class="sort-select">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      `;
    }
  }

  // Get DOM elements after creating them
  filterButtons = document.querySelectorAll('.filter-btn');
  searchInput = document.querySelector('.search-input');
  sortSelect = document.querySelector('.sort-select');

  // Load products
  renderProducts(products);

  // Add event listeners
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', filterByCategory);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', debounce(searchProducts, 300));
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', sortProducts);
  }
}

// Render products to the DOM
function renderProducts(productsToRender) {
  if (!productsContainer) return;

  productsContainer.innerHTML = '';

  if (productsToRender.length === 0) {
    productsContainer.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
    return;
  }

  productsToRender.forEach(product => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}

// Create a product card element
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      ${hasDiscount ? `<span class="discount-badge">-${Math.round((1 - product.discountPrice / product.price) * 100)}%</span>` : ''}
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <div class="product-rating">
        ${generateStars(product.rating)}
        <span class="rating-count">(${product.reviews})</span>
      </div>
      <div class="product-price">
        ${hasDiscount ? 
          `<span class="original-price">$${product.price.toFixed(2)}</span>
           <span class="discount-price">$${product.discountPrice.toFixed(2)}</span>` :
          `<span class="current-price">$${product.price.toFixed(2)}</span>`
        }
      </div>
      <button class="btn btn-primary add-to-cart" data-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;

  // Add event listener for Add to Cart button
  const addToCartBtn = card.querySelector('.add-to-cart');
  addToCartBtn.addEventListener('click', () => addToCart(product.id));

  return card;
}

// Generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

// Filter products by category
function filterByCategory(e) {
  const category = e.target.dataset.category;

  // Update active button
  filterButtons.forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');

  // Filter products
  if (category === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter(product => product.category === category);
    renderProducts(filtered);
  }
}

// Search products
function searchProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === '') {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );

  renderProducts(filtered);
}

// Sort products
function sortProducts() {
  const sortValue = sortSelect.value;
  let sorted = [...products];

  switch (sortValue) {
    case 'price-low':
      sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      break;
    case 'price-high':
      sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
  }

  renderProducts(sorted);
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Add to cart logic here
  console.log(`Added ${product.name} to cart`);

  // Update cart count
  updateCartCount();
}

// Update cart count in header
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;

  // Get current cart count from localStorage or state management
  const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
  const newCount = currentCount + 1;

  localStorage.setItem('cartCount', newCount.toString());
  cartCount.textContent = newCount;
}

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
