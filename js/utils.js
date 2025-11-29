// Utility functions for the Free Online Store

// Format price with currency symbol
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
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

// Show notification message
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

// Get URL parameters
function getUrlParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }

  return params;
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Local storage helpers
const storage = {
  get: function(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return localStorage.getItem(key);
    }
  },

  set: function(key, value) {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  },

  remove: function(key) {
    localStorage.removeItem(key);
  },

  clear: function() {
    localStorage.clear();
  }
};

// Cart management
const cart = {
  get: function() {
    return storage.get('cart') || [];
  },

  add: function(product, quantity = 1) {
    const currentCart = this.get();
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.image,
        quantity: quantity
      });
    }

    storage.set('cart', currentCart);
    this.updateCount();
    showNotification(`${product.name} added to cart`, 'success');
  },

  remove: function(productId) {
    const currentCart = this.get();
    const updatedCart = currentCart.filter(item => item.id !== productId);
    storage.set('cart', updatedCart);
    this.updateCount();
  },

  update: function(productId, quantity) {
    const currentCart = this.get();
    const item = currentCart.find(item => item.id === productId);

    if (item) {
      item.quantity = quantity;
      storage.set('cart', currentCart);
    }
  },

  getTotal: function() {
    const currentCart = this.get();
    return currentCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCount: function() {
    const currentCart = this.get();
    return currentCart.reduce((count, item) => count + item.quantity, 0);
  },

  updateCount: function() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = this.getCount();
    }
  },

  clear: function() {
    storage.remove('cart');
    this.updateCount();
  }
};

// Wishlist management
const wishlist = {
  get: function() {
    return storage.get('wishlist') || [];
  },

  add: function(product) {
    const currentWishlist = this.get();
    const exists = currentWishlist.includes(product.id);

    if (!exists) {
      currentWishlist.push(product.id);
      storage.set('wishlist', currentWishlist);
      showNotification(`${product.name} added to wishlist`, 'success');
    } else {
      showNotification(`${product.name} is already in your wishlist`, 'info');
    }
  },

  remove: function(productId) {
    const currentWishlist = this.get();
    const updatedWishlist = currentWishlist.filter(id => id !== productId);
    storage.set('wishlist', updatedWishlist);
  },

  has: function(productId) {
    return this.get().includes(productId);
  }
};
