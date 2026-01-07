import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers or other request modifications here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors here
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const apiService = {
  // System state
  getSystemState: () => api.get('/system-state'),
  
  // AI endpoints
  getAIStatus: () => api.get('/ai/status'),
  toggleAI: (enabled) => api.post('/ai/toggle', { enabled }),
  getAIDecisions: (limit = 10) => api.get(`/ai/decisions?limit=${limit}`),
  getAICommands: (limit = 10) => api.get(`/ai/commands?limit=${limit}`),
  getAIPredictions: () => api.get('/ai/predictions'),
  
  // Tibber endpoints
  getTibberStatus: () => api.get('/tibber/status'),
  getTibberPrices: () => api.get('/tibber/prices'),
  getTibberConfig: () => api.get('/tibber/config'),
  updateTibberConfig: (config) => api.post('/tibber/config', config),
  toggleTibber: (enabled) => api.post('/tibber/toggle', { enabled }),
  testTibberConnection: () => api.post('/tibber/test'),
  refreshTibberData: () => api.post('/tibber/refresh'),
  
  // Settings
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.post('/settings', settings),
  getConfig: () => api.get('/config/check'),
  saveConfig: (config) => api.post('/config/save', config),
  
  // Analytics
  getAnalytics: (period = '30d') => api.get(`/analytics?period=${period}`),
  
  // Messages
  getMessages: (category = 'all') => api.get(`/messages?category=${category}`),
  
  // Notifications
  getNotifications: () => api.get('/notifications'),
}

export default api