import apiClient from './apiClient.js'
export const teamService = { getAll: () => apiClient.get('/teams'), getRecommendation: (reefId) => apiClient.get('/teams/recommend', { params: { reef_id: reefId } }) }
