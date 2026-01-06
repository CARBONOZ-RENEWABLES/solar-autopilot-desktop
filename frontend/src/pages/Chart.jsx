import React, { useState, useEffect } from 'react'
import { BarChart3, Calendar, Clock, RefreshCw } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import AdvancedLoadingOverlay from '../components/AdvancedLoadingOverlay'
import { usePageLoading } from '../hooks/useLoading'

export default function Chart() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState({ from: '', to: '' })
  const [timezone, setTimezone] = useState('browser')
  const { isDark } = useTheme()
  const { isLoading: pageLoading } = usePageLoading(600, 1200)

  const grafanaHost = 'localhost' // This should come from environment or config

  useEffect(() => {
    // Set default time range (last 24 hours)
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    setTimeRange({
      from: yesterday.toISOString().slice(0, 16),
      to: now.toISOString().slice(0, 16)
    })

    // Hide loading after iframe loads
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const updateIframe = () => {
    if (!timeRange.from || !timeRange.to) {
      alert('Please select both start and end time.')
      return
    }

    const fromUnix = new Date(timeRange.from).getTime()
    const toUnix = new Date(timeRange.to).getTime()
    const theme = isDark ? 'dark' : 'light'
    
    const iframe = document.getElementById('grafanaDashboard')
    if (iframe) {
      iframe.src = `http://${grafanaHost}:3001/d/solar_dashboard/solar-dashboard?orgId=1&kiosk=1&refresh=1m&theme=${theme}&from=${fromUnix}&to=${toUnix}&tz=${timezone}`
    }
  }

  const refreshDashboard = () => {
    setLoading(true)
    const iframe = document.getElementById('grafanaDashboard')
    if (iframe) {
      iframe.src = iframe.src // Force reload
    }
    setTimeout(() => setLoading(false), 1500)
  }

  const presetRanges = [
    { label: 'Last Hour', hours: 1 },
    { label: 'Last 6 Hours', hours: 6 },
    { label: 'Last 24 Hours', hours: 24 },
    { label: 'Last 7 Days', hours: 24 * 7 },
    { label: 'Last 30 Days', hours: 24 * 30 }
  ]

  const setPresetRange = (hours) => {
    const now = new Date()
    const past = new Date(now.getTime() - hours * 60 * 60 * 1000)
    
    setTimeRange({
      from: past.toISOString().slice(0, 16),
      to: now.toISOString().slice(0, 16)
    })
  }

  if (pageLoading) {
    return <AdvancedLoadingOverlay message="Loading chart dashboard..." isDark={isDark} />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center mb-4 lg:mb-0">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Solar Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time monitoring and historical data visualization
            </p>
          </div>
        </div>
        
        <button
          onClick={refreshDashboard}
          disabled={loading}
          className="btn btn-secondary"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Time Range Controls */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Time Range Selection
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preset Ranges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Select
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetRanges.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setPresetRange(preset.hours)}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Custom Range
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                <input
                  type="datetime-local"
                  value={timeRange.from}
                  onChange={(e) => setTimeRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                <input
                  type="datetime-local"
                  value={timeRange.to}
                  onChange={(e) => setTimeRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="browser">Browser</option>
                  <option value="UTC">UTC</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
              <button
                onClick={updateIframe}
                className="w-full btn btn-primary"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Update Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grafana Dashboard */}
      <div className="card p-0 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="loading-spinner mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        )}
        
        <div className="relative" style={{ height: '80vh', minHeight: '600px' }}>
          <iframe
            id="grafanaDashboard"
            src={`http://${grafanaHost}:3001/d/solar_dashboard/solar-dashboard?orgId=1&kiosk=1&refresh=1m&theme=${isDark ? 'dark' : 'light'}`}
            className="w-full h-full border-0"
            title="Solar Dashboard"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </div>
      </div>

      {/* Dashboard Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Data</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Live monitoring of solar production, battery status, and energy consumption with 1-second refresh rate.
          </p>
        </div>
        
        <div className="card">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Historical Analysis</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive historical data analysis with customizable time ranges and detailed performance metrics.
          </p>
        </div>
        
        <div className="card">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Interactive Charts</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Interactive Grafana dashboards with zoom, pan, and detailed tooltips for in-depth data exploration.
          </p>
        </div>
      </div>
    </div>
  )
}