import apiClient from './apiClient.js'
export const alertService = { getAll: () => apiClient.get('/alerts'), getById: (id) => apiClient.get(`/alerts/${id}`) }
