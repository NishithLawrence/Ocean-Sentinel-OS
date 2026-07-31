import apiClient from './apiClient.js'
export const missionService = { getAll: () => apiClient.get('/missions'), create: (payload) => apiClient.post('/missions', payload) }
