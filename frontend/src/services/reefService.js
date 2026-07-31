import apiClient from './apiClient.js'
export const reefService = { getAll: () => apiClient.get('/reefs'), getById: (id) => apiClient.get(`/reefs/${id}`), getAssessment: (id) => apiClient.get(`/reefs/${id}/assessment`) }
