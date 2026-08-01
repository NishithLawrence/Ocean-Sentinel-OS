import apiClient from './apiClient.js'

export const teamService = {
  getAll: () => apiClient.get('/teams'),
  getById: (id) => apiClient.get(`/teams/${id}`),
  create: (payload) => apiClient.post('/teams', payload),
  update: (id, payload) => apiClient.put(`/teams/${id}`, payload),
  remove: (id) => apiClient.delete(`/teams/${id}`),
  getRecommendation: (reefId) => apiClient.get('/teams/recommend', { params: { reef_id: reefId } }),
}
