import apiClient from './apiClient.js'
export const adminService = { getUsers: () => apiClient.get('/admin/users') }
