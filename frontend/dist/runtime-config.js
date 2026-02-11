window.__API_BASE__ = window.__API_BASE__ || '';
window.__IS_OFFLINE__ = window.__IS_OFFLINE__ ?? (!window.__API_BASE__ && !/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname));
