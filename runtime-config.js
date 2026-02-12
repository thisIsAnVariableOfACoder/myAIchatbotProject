window.__API_BASE__ = window.__API_BASE__ || 'https://api-myaichatbotproject.onrender.com';
window.__IS_OFFLINE__ = window.__IS_OFFLINE__ ?? (!window.__API_BASE__ && /(^|\.)github\.io$/i.test(window.location.hostname));
