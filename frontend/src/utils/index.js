import { format, formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

// Format utilities
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  return format(new Date(date), formatStr)
}

export const formatTime = (date) => {
  return format(new Date(date), 'HH:mm')
}

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

// Number formatting utilities
export const formatNumber = (num, decimals = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

export const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatPercentage = (value, decimals = 1) => {
  return `${formatNumber(value, decimals)}%`
}

export const formatPower = (watts) => {
  if (watts >= 1000) {
    return `${formatNumber(watts / 1000, 1)} kW`
  }
  return `${formatNumber(watts, 0)} W`
}

export const formatEnergy = (wh) => {
  if (wh >= 1000) {
    return `${formatNumber(wh / 1000, 1)} kWh`
  }
  return `${formatNumber(wh, 0)} Wh`
}

// Color utilities
export const getStatusColor = (status) => {
  const colors = {
    success: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
    warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
    info: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
    neutral: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300',
  }
  return colors[status] || colors.neutral
}

export const getBatteryColor = (level) => {
  if (level >= 80) return 'text-green-600'
  if (level >= 50) return 'text-yellow-600'
  if (level >= 20) return 'text-orange-600'
  return 'text-red-600'
}

export const getPriceLevelColor = (level) => {
  const colors = {
    'VERY_CHEAP': 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
    'CHEAP': 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
    'NORMAL': 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300',
    'EXPENSIVE': 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200',
    'VERY_EXPENSIVE': 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
  }
  return colors[level] || colors.NORMAL
}

// Data processing utilities
export const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return { value: 0, direction: 'neutral' }
  
  const change = ((current - previous) / previous) * 100
  return {
    value: Math.abs(change),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  }
}

export const calculateAverage = (data, key = 'value') => {
  if (!data || data.length === 0) return 0
  const sum = data.reduce((acc, item) => acc + (item[key] || 0), 0)
  return sum / data.length
}

export const calculateSum = (data, key = 'value') => {
  if (!data || data.length === 0) return 0
  return data.reduce((acc, item) => acc + (item[key] || 0), 0)
}

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidApiKey = (key) => {
  return key && key.length >= 10 && key !== '***'
}

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }
}

// Debounce utility
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Class name utility (re-export clsx for convenience)
export { clsx as cn }

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatPower,
  formatEnergy,
  getStatusColor,
  getBatteryColor,
  getPriceLevelColor,
  calculateTrend,
  calculateAverage,
  calculateSum,
  isValidEmail,
  isValidApiKey,
  storage,
  debounce,
  cn: clsx,
}