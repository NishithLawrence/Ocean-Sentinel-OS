import apiClient from './apiClient.js'

export const missionService = {
  getAll: () => apiClient.get('/missions'),
  getById: (id) => apiClient.get(`/missions/${id}`),
  create: (payload) => apiClient.post('/missions', payload),
  update: (id, payload) => apiClient.put(`/missions/${id}`, payload),
  remove: (id) => apiClient.delete(`/missions/${id}`),
}
