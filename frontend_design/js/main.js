// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    // Ensure toast container exists
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Dynamic Nav Update for Admins
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
        const navIcons = document.querySelector('.nav-icons');
        if (navIcons) {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.title = 'Admin Cyber Panel';
            adminLink.innerHTML = '<i class="fa-solid fa-server" style="color:#bc13fe; text-shadow: 0 0 5px #bc13fe;"></i>';
            // Insert it before the mobile menu button
            navIcons.insertBefore(adminLink, document.querySelector('.mobile-menu-btn'));
        }
    }

    // Update cart badge across all pages
    updateCartBadge();
});

// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Helper function for authenticated API calls
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('aromea_token');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    const response = await fetch(`${API_BASE}${endpoint}`, { ...defaultOptions, ...options });
    return response;
}

// Shared utility: Get cart from local storage (or default to empty)
function getCart() {
    let cart = [];
    try {
        const raw = localStorage.getItem('aromea_cart');
        cart = JSON.parse(raw) || [];
        if (!Array.isArray(cart)) cart = [];

        // Purge corrupt items (null, missing id, missing price)
        const originalLength = cart.length;
        cart = cart.filter(item => item && typeof item === 'object' && (item.id || item.item_id));
        
        cart.forEach(item => {
            if (item.price === undefined || item.price === null || isNaN(item.price)) {
                item.price = 200; // Safe fallback matching dummy data average
            }
            if (!item.quantity) item.quantity = 1;
        });

        // Save repaired cart
        localStorage.setItem('aromea_cart', JSON.stringify(cart));
    } catch(e) {
        cart = [];
        localStorage.removeItem('aromea_cart');
    }
    return cart;
}

// Shared utility: Update cart badge count
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('aromea_token');
}

// Get current user info
function getCurrentUser() {
    const user = localStorage.getItem('aromea_user');
    return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('aromea_token');
    localStorage.removeItem('aromea_user');
    window.location.href = 'index.html';
}
// Global Toast Notification
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    else if (type === 'error') icon = 'fa-exclamation-circle';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400); // Wait for transition
    }, 3000);
}
