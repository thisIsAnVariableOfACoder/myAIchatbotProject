import { API_BASE, IS_OFFLINE } from './config';
import { offlineApi } from './offlineStore';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  return res.json();
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
    if (IS_OFFLINE) {
      return offlineApi.sendMessage({
        conversation_id: payload.conversation_id,
        message: payload.message,
        user_id: payload.user_id,
        user_type: payload.user_type,
        request_more: payload.request_more
      });
    }
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
