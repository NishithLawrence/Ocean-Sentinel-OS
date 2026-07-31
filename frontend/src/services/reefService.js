import apiClient from './apiClient.js'

export const reefService = {
  getAll: () => apiClient.get('/reefs'),
  getById: (id) => apiClient.get(`/reefs/${id}`),
  create: (payload) => apiClient.post('/reefs', payload),
  update: (id, payload) => apiClient.put(`/reefs/${id}`, payload),
  remove: (id) => apiClient.delete(`/reefs/${id}`),
  getAssessment: (id) => apiClient.get(`/reefs/${id}/assessment`),
}
