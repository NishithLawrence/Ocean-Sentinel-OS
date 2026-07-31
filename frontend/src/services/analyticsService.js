import apiClient from './apiClient.js'
export const analyticsService = { getDashboard: () => apiClient.get('/analytics/dashboard') }
