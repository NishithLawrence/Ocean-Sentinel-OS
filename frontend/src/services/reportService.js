import apiClient from './apiClient.js'

export const reportService = {
  getAll: () => apiClient.get('/reports'),
  generate: (payload) => apiClient.post('/reports/generate', payload),
  download: (id) => apiClient.get(`/reports/${id}`, { responseType: 'blob' }),
  remove: (id) => apiClient.delete(`/reports/${id}`),
}
