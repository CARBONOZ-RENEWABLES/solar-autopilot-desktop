import React, { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  Download, 
  Eye, 
  EyeOff,
  Globe,
  Key,
  MapPin,
  Zap,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sliders,
  RefreshCw,
  Wifi,
  Server
} from 'lucide-react'
import clsx from 'clsx'
import AdvancedLoadingOverlay from '../components/AdvancedLoadingOverlay'
import { usePageLoading } from '../hooks/useLoading'
import { useTheme } from '../hooks/useTheme'
import { useWebSocket } from '../hooks/useWebSocket'

export default function Settings() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [settings, setSettings] = useState({
    timezone: 'UTC',
    apiKey: '',
    selectedZone: '',
    tibber: {
      enabled: false,
      apiKey: '',
      country: 'DE'
    },
    mqtt: {
      host: 'localhost',
      port: 1883,
      username: '',
      password: '',
      topicPrefix: 'solar',
      clientId: '',
      clientSecret: '',
      inverterNumber: 1,
      batteryNumber: 1
    }
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [showTibberKey, setShowTibberKey] = useState(false)
  const [showMqttPassword, setShowMqttPassword] = useState(false)
  const [status, setStatus] = useState({
    api: 'checking',
    zone: 'not-set',
    tibber: 'disconnected',
    mqtt: 'disconnected'
  })
  const [rangeSettings, setRangeSettings] = useState({})
  const [tibberPrice, setTibberPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { isLoading: pageLoading } = usePageLoading(500, 1000)
  const { isDark } = useTheme()

  // WebSocket connection for real-time updates
  const { isConnected: wsConnected } = useWebSocket(
    `ws://${window.location.hostname}:8000`,
    (message) => {
      if (message.type === 'config_updated') {
        console.log('Configuration updated via WebSocket')
        // Reload settings when configuration is updated
        loadSettings()
      }
    }
  )

  const zones = [
    { code: 'DE', zoneName: 'Germany' },
    { code: 'NO', zoneName: 'Norway' },
    { code: 'SE', zoneName: 'Sweden' },
    { code: 'DK', zoneName: 'Denmark' },
    { code: 'FI', zoneName: 'Finland' },
    { code: 'AT', zoneName: 'Austria' },
    { code: 'NL', zoneName: 'Netherlands' },
    { code: 'GB', zoneName: 'United Kingdom' }
  ]

  const timezones = [
    { value: 'UTC', label: '(GMT+00:00) UTC' },
    { value: 'Europe/London', label: '(GMT+00:00) London' },
    { value: 'Europe/Berlin', label: '(GMT+01:00) Berlin' },
    { value: 'Europe/Paris', label: '(GMT+01:00) Paris' },
    { value: 'Europe/Rome', label: '(GMT+01:00) Rome' },
    { value: 'Europe/Madrid', label: '(GMT+01:00) Madrid' },
    { value: 'Europe/Amsterdam', label: '(GMT+01:00) Amsterdam' },
    { value: 'Europe/Vienna', label: '(GMT+01:00) Vienna' },
    { value: 'Europe/Stockholm', label: '(GMT+01:00) Stockholm' },
    { value: 'Europe/Oslo', label: '(GMT+01:00) Oslo' },
    { value: 'Europe/Copenhagen', label: '(GMT+01:00) Copenhagen' },
    { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki' },
    { value: 'Europe/Athens', label: '(GMT+02:00) Athens' },
    { value: 'America/New_York', label: '(GMT-05:00) New York' },
    { value: 'America/Chicago', label: '(GMT-06:00) Chicago' },
    { value: 'America/Denver', label: '(GMT-07:00) Denver' },
    { value: 'America/Los_Angeles', label: '(GMT-08:00) Los Angeles' },
    { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
    { value: 'Asia/Shanghai', label: '(GMT+08:00) Shanghai' },
    { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney' }
  ]

  const categories = [
    {
      id: 'general',
      name: 'General Settings',
      description: 'Basic system configuration',
      icon: SettingsIcon
    },
    {
      id: 'mqtt',
      name: 'MQTT Broker',
      description: 'Message broker configuration',
      icon: Wifi
    },
    {
      id: 'tibber',
      name: 'Tibber Settings',
      description: 'Dynamic pricing configuration',
      icon: Zap
    },
    {
      id: 'range',
      name: 'Range Settings',
      description: 'Device range configuration',
      icon: Sliders
    }
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Load current settings from options.json
      const configResponse = await fetch('/api/config/check')
      if (configResponse.ok) {
        const configData = await configResponse.json()
        if (configData.success) {
          setSettings(prev => ({
            ...prev,
            mqtt: {
              ...prev.mqtt,
              host: configData.config.mqtt_host || 'localhost',
              port: configData.config.mqtt_port || 1883,
              username: configData.config.mqtt_username || '',
              password: configData.config.mqtt_password || '',
              topicPrefix: configData.config.mqtt_topic_prefix || 'solar',
              clientId: configData.config.clientId || '',
              clientSecret: configData.config.clientSecret || '',
              inverterNumber: configData.config.inverter_number || 1,
              batteryNumber: configData.config.battery_number || 1
            },
            timezone: configData.config.timezone || 'UTC'
          }))
        }
      }

      // Load general settings from settings.json
      const settingsResponse = await fetch('/api/settings')
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        if (settingsData.success) {
          setSettings(prev => ({
            ...prev,
            apiKey: settingsData.apiKey || '',
            selectedZone: settingsData.selectedZone || ''
          }))
        }
      }

      // Load Tibber settings
      const tibberResponse = await fetch('/api/tibber/config')
      if (tibberResponse.ok) {
        const tibberData = await tibberResponse.json()
        if (tibberData.success) {
          setSettings(prev => ({
            ...prev,
            tibber: {
              enabled: tibberData.config.enabled || false,
              apiKey: tibberData.config.apiKey || '',
              country: tibberData.config.country || 'DE'
            }
          }))
        }
      }
      
      // Load range settings from backend
      const rangeResponse = await fetch('/api/solar-data')
      if (rangeResponse.ok) {
        const rangeData = await rangeResponse.json()
        setRangeSettings(rangeData)
      } else {
        // Set default range settings if API fails
        setRangeSettings({
          'Load Power': { title: 'Load Power', min: 0, max: 5000, unit: 'W' },
          'Grid Voltage': { title: 'Grid Voltage', min: 200, max: 250, unit: 'V' },
          'Battery Power': { title: 'Battery Power', min: -3000, max: 3000, unit: 'W' },
          'Grid Power': { title: 'Grid Power', min: -5000, max: 5000, unit: 'W' },
          'Solar PV Power': { title: 'Solar PV Power', min: 0, max: 8000, unit: 'W' },
          'Battery SOC': { title: 'Battery SOC', min: 0, max: 100, unit: '%' },
          'Battery Voltage': { title: 'Battery Voltage', min: 48, max: 58, unit: 'V' }
        })
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading settings:', error)
      // Set default range settings on error
      setRangeSettings({
        'Load Power': { title: 'Load Power', min: 0, max: 5000, unit: 'W' },
        'Grid Voltage': { title: 'Grid Voltage', min: 200, max: 250, unit: 'V' },
        'Battery Power': { title: 'Battery Power', min: -3000, max: 3000, unit: 'W' },
        'Grid Power': { title: 'Grid Power', min: -5000, max: 5000, unit: 'W' },
        'Solar PV Power': { title: 'Solar PV Power', min: 0, max: 8000, unit: 'W' },
        'Battery SOC': { title: 'Battery SOC', min: 0, max: 100, unit: '%' },
        'Battery Voltage': { title: 'Battery Voltage', min: 48, max: 58, unit: 'V' }
      })
      setLoading(false)
    }
  }

  const showToast = (message, type) => {
    console.log(`${type.toUpperCase()}: ${message}`)
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // Save general settings (apiKey, selectedZone) to settings.json
      const generalSettingsResponse = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: settings.apiKey,
          selectedZone: settings.selectedZone,
          timezone: settings.timezone
        })
      })
      
      if (!generalSettingsResponse.ok) {
        throw new Error('Failed to save general settings')
      }
      
      // Save MQTT configuration to options.json
      const configData = {
        mqtt_host: settings.mqtt.host,
        mqtt_port: settings.mqtt.port,
        mqtt_username: settings.mqtt.username,
        mqtt_password: settings.mqtt.password,
        mqtt_topic_prefix: settings.mqtt.topicPrefix,
        clientId: settings.mqtt.clientId,
        clientSecret: settings.mqtt.clientSecret,
        inverter_number: settings.mqtt.inverterNumber,
        battery_number: settings.mqtt.batteryNumber,
        timezone: settings.timezone
      }
      
      const configResponse = await fetch('/api/config/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
      })
      
      if (!configResponse.ok) {
        throw new Error('Failed to save configuration')
      }
      
      // Save Tibber settings
      const tibberResponse = await fetch('/api/tibber/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enabled: settings.tibber.enabled,
          apiKey: settings.tibber.apiKey,
          country: settings.tibber.country
        })
      })
      
      if (!tibberResponse.ok) {
        throw new Error('Failed to save Tibber configuration')
      }
      
      showToast('Settings saved successfully', 'success')
    } catch (error) {
      console.error('Error saving settings:', error)
      showToast('Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const saveRangeSettings = async () => {
    try {
      const response = await fetch('/api/update-panel-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rangeSettings)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save range settings')
      }
      
      showToast('Range settings saved successfully', 'success')
    } catch (error) {
      console.error('Error saving range settings:', error)
      showToast('Failed to save range settings', 'error')
    }
  }

  const StatusIndicator = ({ status, label }) => {
    const colors = {
      connected: 'text-green-500',
      configured: 'text-green-500',
      'not-configured': 'text-red-500',
      'not-set': 'text-red-500',
      disconnected: 'text-red-500',
      error: 'text-red-500',
      checking: 'text-yellow-500'
    }

    const icons = {
      connected: CheckCircle,
      configured: CheckCircle,
      'not-configured': XCircle,
      'not-set': XCircle,
      disconnected: XCircle,
      error: XCircle,
      checking: AlertCircle
    }

    const Icon = icons[status] || AlertCircle

    return (
      <div className="flex items-center">
        <Icon className={clsx('w-4 h-4 mr-2', colors[status])} />
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
    )
  }

  const SettingCard = ({ icon: Icon, title, description, children, className = "" }) => (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6', className)}>
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )

  if (pageLoading || loading) {
    return <AdvancedLoadingOverlay message="Loading system settings..." isDark={isDark} />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your SolarAutopilot system for optimal performance
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save All'}
          </button>
          <button
            onClick={() => showToast('Settings reset', 'info')}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
          <button
            onClick={() => showToast('Settings exported', 'success')}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={clsx(
                'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                activeCategory === category.id
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
              )}
            >
              <div className="flex items-center mb-2">
                <Icon className={clsx('w-6 h-6 mr-3', 
                  activeCategory === category.id ? 'text-primary' : 'text-gray-500'
                )} />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.description}
              </p>
            </button>
          )
        })}
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {activeCategory === 'general' && (
          <>
            <SettingCard
              icon={Globe}
              title="Timezone"
              description="Set your local timezone for accurate scheduling"
            >
              <select
                value={settings.timezone}
                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </SettingCard>

            <SettingCard
              icon={Key}
              title="Electricity Map API Key"
              description="Required for carbon intensity data"
            >
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Enter API key"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <a
                  href="https://www.electricitymaps.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Get your API key →
                </a>
              </div>
            </SettingCard>

            <SettingCard
              icon={MapPin}
              title="Carbon Intensity Zone"
              description="Select your electricity grid zone"
            >
              <select
                value={settings.selectedZone}
                onChange={(e) => setSettings(prev => ({ ...prev, selectedZone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="">-- Select a zone --</option>
                {zones.map(zone => (
                  <option key={zone.code} value={zone.code}>
                    {zone.zoneName} ({zone.code})
                  </option>
                ))}
              </select>
            </SettingCard>

            <SettingCard
              icon={CheckCircle}
              title="System Status"
              description="Current system health and connectivity"
            >
              <div className="space-y-3">
                <StatusIndicator 
                  status={status.api} 
                  label={status.api === 'connected' ? 'API Connected' : 'API Not Configured'} 
                />
                <StatusIndicator 
                  status={status.zone} 
                  label={status.zone === 'configured' ? 'Zone Configured' : 'Zone Not Set'} 
                />
                <StatusIndicator 
                  status={wsConnected ? 'connected' : 'disconnected'} 
                  label={wsConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'} 
                />
              </div>
            </SettingCard>
          </>
        )}

        {activeCategory === 'mqtt' && (
          <>
            <SettingCard
              icon={Server}
              title="MQTT Broker Host"
              description="IP address or hostname of your MQTT broker"
            >
              <input
                type="text"
                value={settings.mqtt.host}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  mqtt: { ...prev.mqtt, host: e.target.value }
                }))}
                placeholder="localhost or 192.168.1.100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </SettingCard>

            <SettingCard
              icon={Wifi}
              title="MQTT Port"
              description="Port number for MQTT connection (default: 1883)"
            >
              <input
                type="number"
                value={settings.mqtt.port}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  mqtt: { ...prev.mqtt, port: parseInt(e.target.value) }
                }))}
                placeholder="1883"
                min="1"
                max="65535"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </SettingCard>

            <SettingCard
              icon={Key}
              title="MQTT Authentication"
              description="Username, password, and optional client credentials"
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={settings.mqtt.username}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      mqtt: { ...prev.mqtt, username: e.target.value }
                    }))}
                    placeholder="MQTT username (optional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showMqttPassword ? 'text' : 'password'}
                      value={settings.mqtt.password}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        mqtt: { ...prev.mqtt, password: e.target.value }
                      }))}
                      placeholder="MQTT password (optional)"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMqttPassword(!showMqttPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showMqttPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Client ID (optional)
                  </label>
                  <input
                    type="text"
                    value={settings.mqtt.clientId}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      mqtt: { ...prev.mqtt, clientId: e.target.value }
                    }))}
                    placeholder="MQTT client ID (optional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Client Secret (optional)
                  </label>
                  <input
                    type="password"
                    value={settings.mqtt.clientSecret}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      mqtt: { ...prev.mqtt, clientSecret: e.target.value }
                    }))}
                    placeholder="MQTT client secret (optional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard
              icon={MapPin}
              title="Topic Prefix"
              description="Prefix for MQTT topics (e.g., 'solar', 'inverter')"
            >
              <input
                type="text"
                value={settings.mqtt.topicPrefix}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  mqtt: { ...prev.mqtt, topicPrefix: e.target.value }
                }))}
                placeholder="solar"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Topics will be: {settings.mqtt.topicPrefix || 'solar'}/inverter/1/...
              </p>
            </SettingCard>

            <SettingCard
              icon={Sliders}
              title="System Configuration"
              description="Number of inverters and batteries in your system"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Inverters
                  </label>
                  <input
                    type="number"
                    value={settings.mqtt.inverterNumber}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      mqtt: { ...prev.mqtt, inverterNumber: parseInt(e.target.value) || 1 }
                    }))}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Batteries
                  </label>
                  <input
                    type="number"
                    value={settings.mqtt.batteryNumber}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      mqtt: { ...prev.mqtt, batteryNumber: parseInt(e.target.value) || 1 }
                    }))}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard
              icon={TestTube}
              title="MQTT Status"
              description="Current broker connection status"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Connection</span>
                    <StatusIndicator 
                      status={status.mqtt} 
                      label={status.mqtt === 'connected' ? 'Connected' : 'Disconnected'} 
                    />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Broker</span>
                    <div className="font-semibold">
                      {settings.mqtt.host}:{settings.mqtt.port}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => showToast('Testing MQTT connection...', 'info')}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 flex items-center flex-1"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </button>
                  <button
                    onClick={() => showToast('Reconnecting to MQTT...', 'info')}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 flex items-center flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reconnect
                  </button>
                </div>
              </div>
            </SettingCard>
          </>
        )}

        {activeCategory === 'tibber' && (
          <>
            <SettingCard
              icon={Zap}
              title="Enable Tibber Integration"
              description="Activate dynamic pricing for optimal charging"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.tibber.enabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    tibber: { ...prev.tibber, enabled: e.target.checked }
                  }))}
                  className="mr-3"
                />
                <span>Enable Tibber Integration</span>
              </label>
            </SettingCard>

            <SettingCard
              icon={Key}
              title="Tibber API Key"
              description="Your personal Tibber API access token"
            >
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showTibberKey ? 'text' : 'password'}
                    value={settings.tibber.apiKey}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      tibber: { ...prev.tibber, apiKey: e.target.value }
                    }))}
                    placeholder="Enter Tibber API key"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTibberKey(!showTibberKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTibberKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <a
                  href="https://developer.tibber.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Get your Tibber API key →
                </a>
              </div>
            </SettingCard>

            <SettingCard
              icon={Globe}
              title="Country"
              description="Select your country for proper pricing"
            >
              <select
                value={settings.tibber.country}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  tibber: { ...prev.tibber, country: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="DE">🇩🇪 Germany</option>
                <option value="NO">🇳🇴 Norway</option>
                <option value="SE">🇸🇪 Sweden</option>
                <option value="DK">🇩🇰 Denmark</option>
                <option value="FI">🇫🇮 Finland</option>
                <option value="AT">🇦🇹 Austria</option>
                <option value="NL">🇳🇱 Netherlands</option>
                <option value="GB">🇬🇧 United Kingdom</option>
              </select>
            </SettingCard>

            <SettingCard
              icon={TestTube}
              title="Tibber Status"
              description="Current pricing and connection status"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Connection</span>
                    <StatusIndicator 
                      status={status.tibber} 
                      label={status.tibber === 'connected' ? 'Connected' : 'Disconnected'} 
                    />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Price</span>
                    <div className="font-semibold">
                      {tibberPrice ? `${tibberPrice.total.toFixed(2)} cent/kWh` : '-- cent/kWh'}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => showToast('Testing connection...', 'info')}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 flex items-center flex-1"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </button>
                  <button
                    onClick={() => showToast('Refreshing data...', 'info')}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 flex items-center flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>
            </SettingCard>
          </>
        )}

        {activeCategory === 'range' && (
          <div className="space-y-6">
            {Object.entries(rangeSettings).map(([key, config]) => {
              // Icon mapping for different range types
              const getIcon = (title) => {
                const t = title.toLowerCase()
                if (t.includes('load') && t.includes('power')) return '🏠'
                if (t.includes('grid') && t.includes('voltage')) return '⚡'
                if (t.includes('battery') && t.includes('power')) return '🔋'
                if (t.includes('grid') && t.includes('power')) return '🔌'
                if (t.includes('solar') || t.includes('pv')) return '☀️'
                if (t.includes('battery') && t.includes('soc')) return '📊'
                if (t.includes('battery') && t.includes('voltage')) return '🔋'
                return '⚙️'
              }
              
              return (
                <SettingCard
                  key={key}
                  icon={Sliders}
                  title={`${getIcon(config.title || key)} ${config.title || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`}
                  description="Configure min/max values and operational thresholds"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Min Value
                      </label>
                      <input
                        type="number"
                        value={config.min || 0}
                        onChange={(e) => setRangeSettings(prev => ({
                          ...prev,
                          [key]: { ...prev[key], min: parseFloat(e.target.value) }
                        }))}
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Value
                      </label>
                      <input
                        type="number"
                        value={config.max || 100}
                        onChange={(e) => setRangeSettings(prev => ({
                          ...prev,
                          [key]: { ...prev[key], max: parseFloat(e.target.value) }
                        }))}
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unit
                      </label>
                      <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 font-mono">
                        {config.unit || 'W'}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        // Reset to default values
                        const defaults = {
                          'Load Power': { min: 0, max: 5000 },
                          'Grid Voltage': { min: 200, max: 250 },
                          'Battery Power': { min: -3000, max: 3000 },
                          'Grid Power': { min: -5000, max: 5000 },
                          'Solar PV Power': { min: 0, max: 8000 },
                          'Battery SOC': { min: 0, max: 100 },
                          'Battery Voltage': { min: 48, max: 58 }
                        }
                        if (defaults[key]) {
                          setRangeSettings(prev => ({
                            ...prev,
                            [key]: { ...prev[key], ...defaults[key] }
                          }))
                        }
                        showToast(`${config.title || key} reset to defaults`, 'info')
                      }}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset
                    </button>
                    <button
                      onClick={() => {
                        saveRangeSettings()
                      }}
                      className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-600 flex items-center"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </button>
                  </div>
                </SettingCard>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}