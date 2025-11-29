// Account functionality for Free Online Store Template
// DOM elements
let accountContainer;

// Initialize account page
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('account.html')) {
    initAccountPage();
  }
});

function initAccountPage() {
  accountContainer = document.querySelector('.account-container');

  // Check if user is logged in
  const isLoggedIn = checkLoginStatus();

  if (isLoggedIn) {
    renderAccountDashboard();
  } else {
    renderLoginForm();
  }
}

// Check if user is logged in
function checkLoginStatus() {
  // In a real app, this would check for a valid session/token
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Render login form
function renderLoginForm() {
  if (!accountContainer) return;

  accountContainer.innerHTML = `
    <div class="account-form-container">
      <div class="account-tabs">
        <button class="tab-btn active" data-tab="login">Login</button>
        <button class="tab-btn" data-tab="register">Register</button>
      </div>

      <div class="tab-content">
        <div class="tab-pane active" id="login-tab">
          <form id="login-form" class="account-form">
            <h2>Login to Your Account</h2>

            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" required>
            </div>

            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" required>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Login</button>
              <a href="#" class="forgot-password">Forgot Password?</a>
            </div>
          </form>
        </div>

        <div class="tab-pane" id="register-tab">
          <form id="register-form" class="account-form">
            <h2>Create an Account</h2>

            <div class="form-group">
              <label for="register-name">Full Name</label>
              <input type="text" id="register-name" required>
            </div>

            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" required>
            </div>

            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" required>
            </div>

            <div class="form-group">
              <label for="register-confirm-password">Confirm Password</label>
              <input type="password" id="register-confirm-password" required>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', switchTab);
  });

  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('register-form').addEventListener('submit', handleRegister);
}

// Switch between login and register tabs
function switchTab(e) {
  const tabName = e.target.dataset.tab;

  // Update active tab button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');

  // Update active tab content
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // In a real app, this would validate credentials against a backend
  // For demo purposes, we'll just simulate a successful login
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', email);

  // Show success message
  showNotification('Login successful! Redirecting...', 'success');

  // Redirect to dashboard after a short delay
  setTimeout(() => {
    renderAccountDashboard();
  }, 1500);
}

// Handle registration form submission
function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  // Validate passwords match
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }

  // In a real app, this would create a user account in the backend
  // For demo purposes, we'll just simulate a successful registration
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', name);

  // Show success message
  showNotification('Registration successful! Redirecting...', 'success');

  // Redirect to dashboard after a short delay
  setTimeout(() => {
    renderAccountDashboard();
  }, 1500);
}

// Render account dashboard
function renderAccountDashboard() {
  if (!accountContainer) return;

  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || '';

  accountContainer.innerHTML = `
    <div class="account-layout">
      <div class="account-sidebar">
        <div class="user-profile">
          <div class="user-avatar">
            <img src="../images/avatar.jpg" alt="${userName}">
          </div>
          <h3>${userName}</h3>
          <p>${userEmail}</p>
        </div>

        <nav class="account-nav">
          <ul>
            <li><a href="#" class="nav-link active" data-section="dashboard">Dashboard</a></li>
            <li><a href="#" class="nav-link" data-section="profile">Profile</a></li>
            <li><a href="#" class="nav-link" data-section="orders">Orders</a></li>
            <li><a href="#" class="nav-link" data-section="settings">Settings</a></li>
            <li><a href="#" class="nav-link" id="logout-link">Logout</a></li>
          </ul>
        </nav>
      </div>

      <div class="account-content">
        <div id="dashboard-section" class="account-section active">
          <h2>Dashboard</h2>
          <div class="dashboard-stats">
            <div class="stat-card">
              <h3>Total Orders</h3>
              <p class="stat-value">5</p>
            </div>
            <div class="stat-card">
              <h3>Total Spent</h3>
              <p class="stat-value">$542.99</p>
            </div>
            <div class="stat-card">
              <h3>Wishlist Items</h3>
              <p class="stat-value">8</p>
            </div>
          </div>

          <div class="recent-orders">
            <h3>Recent Orders</h3>
            <div class="order-list">
              <div class="order-card">
                <div class="order-info">
                  <h4>Order #12345</h4>
                  <p>Placed on June 15, 2023</p>
                </div>
                <div class="order-status">
                  <span class="status-badge status-delivered">Delivered</span>
                </div>
                <div class="order-total">
                  <p>$129.99</p>
                </div>
              </div>

              <div class="order-card">
                <div class="order-info">
                  <h4>Order #12344</h4>
                  <p>Placed on June 10, 2023</p>
                </div>
                <div class="order-status">
                  <span class="status-badge status-shipped">Shipped</span>
                </div>
                <div class="order-total">
                  <p>$89.99</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="profile-section" class="account-section">
          <h2>Profile Information</h2>
          <form id="profile-form" class="account-form">
            <div class="form-group">
              <label for="profile-name">Full Name</label>
              <input type="text" id="profile-name" value="${userName}" required>
            </div>

            <div class="form-group">
              <label for="profile-email">Email</label>
              <input type="email" id="profile-email" value="${userEmail}" required>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>

        <div id="orders-section" class="account-section">
          <h2>Order History</h2>
          <div class="order-list">
            <!-- Orders will be loaded here -->
          </div>
        </div>

        <div id="settings-section" class="account-section">
          <h2>Account Settings</h2>
          <form id="settings-form" class="account-form">
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" checked>
                <span>Subscribe to newsletter</span>
              </label>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" checked>
                <span>Receive order updates via email</span>
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save Settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Add event listeners for dashboard navigation
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.target.dataset.section;
      if (section === 'dashboard') {
        showSection('dashboard-section');
      } else if (section === 'profile') {
        showSection('profile-section');
      } else if (section === 'orders') {
        showSection('orders-section');
      } else if (section === 'settings') {
        showSection('settings-section');
      }
    });
  });

  // Logout link
  document.getElementById('logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    handleLogout();
  });

  // Profile form submission
  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;

    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);

    showNotification('Profile updated successfully', 'success');
  });

  // Settings form submission
  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Settings saved successfully', 'success');
  });
}

// Show a specific section in the account dashboard
function showSection(sectionId) {
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[data-section="${sectionId.replace('-section', '')}"]`).classList.add('active');

  // Show the section
  document.querySelectorAll('.account-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');

  showNotification('Logged out successfully', 'success');

  setTimeout(() => {
    renderLoginForm();
  }, 1000);
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
