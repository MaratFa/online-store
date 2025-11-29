// Main application file for Free Online Store Template
// Data will be loaded from data.js script tag

// DOM elements
const header = document.getElementById('header');
const footer = document.getElementById('footer');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load header and footer
  loadHeader();
  loadFooter();

  // Initialize page-specific functionality
  initPage();
});

// Load header component
function loadHeader() {
  if (!header) return;

  header.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <a href="index.html" class="brand-logo">
            <img src="images/favicon.ico" alt="Free Online Store Template" />
            Free Store
          </a>
        </div>

        <ul class="navbar-nav">
          <li class="nav-item">
            <a href="index.html" class="nav-link">Home</a>
          </li>
          <li class="nav-item">
            <a href="pages/products.html" class="nav-link">Products</a>
          </li>
          <li class="nav-item">
            <a href="pages/account.html" class="nav-link">Account</a>
          </li>
        </ul>

        <div class="navbar-actions">
          <button class="btn-icon" id="search-btn" aria-label="Search">
            <i class="fas fa-search"></i>
          </button>
          <button class="btn-icon" id="cart-btn" aria-label="Shopping Cart">
            <i class="fas fa-shopping-cart"></i>
            <span class="badge" id="cart-count">0</span>
          </button>
        </div>

        <button class="navbar-toggle" id="navbar-toggle" aria-label="Toggle navigation">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </nav>
  `;

  // Add event listeners
  document.getElementById('navbar-toggle').addEventListener('click', toggleMobileMenu);
  document.getElementById('search-btn').addEventListener('click', openSearch);
  document.getElementById('cart-btn').addEventListener('click', openCart);
}

// Load footer component
function loadFooter() {
  if (!footer) return;

  footer.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>About Free Store</h3>
            <p>A completely free online store template for modern e-commerce websites. Built with HTML, CSS, and JavaScript.</p>
          </div>

          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="pages/products.html">Products</a></li>
              <li><a href="pages/account.html">Account</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Categories</h3>
            <ul>
              ${categories.slice(1).map(cat => `<li><a href="pages/products.html?category=${encodeURIComponent(cat)}">${cat}</a></li>`).join('')}
            </ul>
          </div>

          <div class="footer-section">
            <h3>Connect</h3>
            <div class="social-links">
              <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} Free Online Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}

// Toggle mobile menu
function toggleMobileMenu() {
  const navbar = document.querySelector('.navbar');
  navbar.classList.toggle('navbar-open');
}

// Open search modal
function openSearch() {
  // Implementation for search functionality
  console.log('Search clicked');
}

// Open cart modal
function openCart() {
  // Implementation for cart functionality
  console.log('Cart clicked');
}

// Initialize page-specific functionality
function initPage() {
  const currentPath = window.location.pathname;

  if (currentPath.includes('products.html')) {
    // Products page is handled by products.js
  } else if (currentPath.includes('account.html')) {
    // Account page is handled by account.js
  } else {
    initHomePage();
  }
}

// Initialize home page
function initHomePage() {
  // Load featured products
  loadFeaturedProducts();
  
  // Load categories
  loadCategories();
  
  // Setup newsletter form
  setupNewsletterForm();
  
  console.log('Home page initialized');
}

// Load featured products on home page
function loadFeaturedProducts() {
  const featuredProductsGrid = document.getElementById('featured-products-grid');
  if (!featuredProductsGrid) return;
  
  // Get 6 random products to feature
  const featured = [...products].sort(() => 0.5 - Math.random()).slice(0, 6);
  
  // Create product cards
  featured.forEach(product => {
    const productCard = createProductCard(product);
    featuredProductsGrid.appendChild(productCard);
  });
}

// Load categories on home page
function loadCategories() {
  const categoriesGrid = document.getElementById('categories-grid');
  if (!categoriesGrid) return;
  
  // Create category cards
  categories.slice(1).forEach(category => {
    const categoryCard = createCategoryCard(category);
    categoriesGrid.appendChild(categoryCard);
  });
}

// Create a category card element
function createCategoryCard(category) {
  const card = document.createElement('div');
  card.className = 'category-card';
  
  // Get a product from this category for image
  const categoryProduct = products.find(p => p.category === category);
  const imageSrc = categoryProduct ? categoryProduct.image : 'images/placeholder.jpg';
  
  card.innerHTML = `
    <div class="category-image">
      <img src="${imageSrc}" alt="${category}">
    </div>
    <h3>${category}</h3>
    <a href="pages/products.html?category=${encodeURIComponent(category)}" class="btn btn-outline">Shop Now</a>
  `;
  
  return card;
}

// Setup newsletter form
function setupNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (!newsletterForm) return;
  
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();
    
    if (!email) {
      showNotification('Please enter your email address', 'error');
      return;
    }
    
    // In a real app, this would send email to a backend
    // For demo purposes, we'll just show a success message
    showNotification(`Thank you for subscribing with ${email}!`, 'success');
    emailInput.value = '';
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

// Show notification
function showNotification(message, type = 'info') {
  // Check if notification container exists, create if not
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Remove after animation
  setTimeout(() => {
    notification.classList.add('notification-hide');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}
