import { API_BASE, IS_OFFLINE } from './config';
import { offlineApi } from './offlineStore';

function buildUrl(path) {
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path}`;
  if (!API_BASE) return normalizedPath;
  return `${API_BASE}${normalizedPath}`;
}

function shouldBlockRelativeApiCall(path) {
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path}`;
  if (!normalizedPath.startsWith('/api/')) return false;
  if (API_BASE) return false;
  if (typeof window === 'undefined') return false;
  const hostname = String(window.location?.hostname || '');
  const isLocalhost = /^(localhost|127\.0\.0\.1)$/i.test(hostname);
  return !isLocalhost;
}

async function request(path, options = {}) {
  if (shouldBlockRelativeApiCall(path)) {
    return {
      success: false,
      error: 'Backend API chưa được cấu hình. Cập nhật window.__API_BASE__ trong runtime-config.js.'
    };
  }

  try {
    const res = await fetch(buildUrl(path), options);
    const text = await res.text();
    let json = null;

    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }

    if (!res.ok) {
      return {
        success: false,
        error: json?.error || `Request failed (${res.status})`
      };
    }

    if (json && typeof json === 'object') return json;
    return { success: true, data: null };
  } catch {
    return {
      success: false,
      error: 'Không thể kết nối máy chủ. Vui lòng kiểm tra API hoặc thử lại.'
    };
  }
}

export const api = {
  async login(body) {
    if (IS_OFFLINE) return offlineApi.login(body);
    return request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  },
  async register(body) {
    if (IS_OFFLINE) return offlineApi.register(body);
    return request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  },
  async me(token) {
    if (IS_OFFLINE) return offlineApi.getMe(token);
    return request('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async getProfile(userId, token) {
    if (IS_OFFLINE) return offlineApi.getProfile(userId);
    return request(`/api/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async updateProfile(userId, token, payload) {
    if (IS_OFFLINE) return offlineApi.updateProfile(userId, payload);
    return request(`/api/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
  },
  async sendMessage(payload, token) {
    // Backend-only: chatbot replies must always come from server APIs.
    return request('/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
  },
  async getHistory(userId, token) {
    if (IS_OFFLINE) return offlineApi.getHistory(userId);
    return request(`/api/chat/history/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async getMessages(conversationId, token) {
    if (IS_OFFLINE) return offlineApi.getMessages(conversationId);
    return request(`/api/chat/messages/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async getRecommendations(conversationId, token) {
    if (IS_OFFLINE) return offlineApi.getRecommendations(conversationId);
    return request(`/api/chat/recommendations/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async renameConversation(conversationId, title, token) {
    if (IS_OFFLINE) return offlineApi.renameConversation(conversationId, title);
    return request(`/api/chat/conversation/${conversationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title })
    });
  },
  async deleteConversation(conversationId, token) {
    if (IS_OFFLINE) return offlineApi.deleteConversation(conversationId);
    return request(`/api/chat/conversation/${conversationId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async deleteHistory(userId, token) {
    if (IS_OFFLINE) return offlineApi.deleteHistory(userId);
    return request(`/api/chat/history/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async exploreFilters() {
    if (IS_OFFLINE) return offlineApi.exploreFilters();
    return request('/api/explore/filters');
  },
  async exploreJobs(params) {
    if (IS_OFFLINE) return offlineApi.exploreJobs(params);
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.category) query.set('category', params.category);
    if (params.tag) query.set('tag', params.tag);
    if (params.limit) query.set('limit', String(params.limit));
    if (params.offset) query.set('offset', String(params.offset));
    return request(`/api/explore/jobs?${query.toString()}`);
  },
  async getScenarios(token) {
    if (IS_OFFLINE) return { success: true, data: [] };
    return request('/api/admin/scenarios', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async saveScenario(payload, token, id) {
    if (IS_OFFLINE) return { success: true, data: { updated: true } };
    return request(id ? `/api/admin/scenario/${id}` : '/api/admin/scenario', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
  },
  async deleteScenario(id, token) {
    if (IS_OFFLINE) return { success: true, data: { deleted: true } };
    return request(`/api/admin/scenario/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async analyticsSummary(token) {
    if (IS_OFFLINE) return { success: true, data: null };
    return request('/api/analytics/summary', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
