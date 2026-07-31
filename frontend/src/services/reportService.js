import apiClient from './apiClient.js'
export const reportService = { getAll: () => apiClient.get('/reports'), generate: (payload) => apiClient.post('/reports', payload) }
