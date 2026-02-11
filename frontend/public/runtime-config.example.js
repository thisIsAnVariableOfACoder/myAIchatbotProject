// Copy this file to runtime-config.js and set your backend API URL for production.
// Example: window.__API_BASE__ = 'https://your-backend.example.com';

window.__API_BASE__ = window.__API_BASE__ || '';

// If API_BASE is empty on GitHub Pages, app will run in offline mode by default.
window.__IS_OFFLINE__ = window.__IS_OFFLINE__ ?? (!window.__API_BASE__ && /(^|\.)github\.io$/i.test(window.location.hostname));

