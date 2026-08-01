import apiClient from './apiClient.js'

export const analyticsService = {
  getDashboard: () => apiClient.get('/analytics/dashboard'),
  getMissionStatus: () => apiClient.get('/analytics/mission-status'),
  getCoralHealth: () => apiClient.get('/analytics/coral-health'),
  getTeamSpecialization: () => apiClient.get('/analytics/team-specialization'),
  getReefsByCountry: () => apiClient.get('/analytics/reefs-by-country'),
}
