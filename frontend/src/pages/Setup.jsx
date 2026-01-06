import React, { useState, useEffect } from 'react'
import { 
  Wifi, 
  Zap, 
  Globe, 
  Key, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Eye,
  EyeOff,
  Server,
  Sparkles,
  Save
} from 'lucide-react'
import clsx from 'clsx'
import AdvancedLoadingOverlay from '../components/AdvancedLoadingOverlay'

export default function Setup({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showPasswords, setShowPasswords] = useState({
    mqtt: false,
    tibber: false
  })
  const [config, setConfig] = useState({
    mqtt: {
      host: 'localhost',
      port: 1883,
      username: '',
      password: '',
      topicPrefix: 'solar',
      batteryNumber: 1,
      inverterNumber: 1
    },
    tibber: {
      enabled: false,
      apiKey: '',
      country: 'DE'
    },
    general: {
      timezone: 'UTC',
      apiKey: '',
      selectedZone: ''
    }
  })

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to SolarAutopilot',
      subtitle: 'Let\'s get your system configured',
      icon: Sparkles,
      required: true
    },
    {
      id: 'mqtt',
      title: 'MQTT Broker',
      subtitle: 'Configure your message broker',
      icon: Wifi,
      required: true
    },
    {
      id: 'tibber',
      title: 'Tibber Integration',
      subtitle: 'Dynamic pricing (optional)',
      icon: Zap,
      required: false
    },
    {
      id: 'general',
      title: 'General Settings',
      subtitle: 'Additional configuration (optional)',
      icon: Globe,
      required: false
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      subtitle: 'Ready to start monitoring',
      icon: CheckCircle,
      required: true
    }
  ]

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
    { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki' }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500)
  }, [])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    const step = steps[currentStep]
    if (!step.required) return true
    
    switch (step.id) {
      case 'mqtt':
        return config.mqtt.host && config.mqtt.port && config.mqtt.topicPrefix
      case 'welcome':
      case 'complete':
        return true
      default:
        return true
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/config/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inverter_number: config.mqtt.inverterNumber,
          battery_number: config.mqtt.batteryNumber,
          mqtt_topic_prefix: config.mqtt.topicPrefix,
          mqtt_host: config.mqtt.host,
          mqtt_port: config.mqtt.port,
          mqtt_username: config.mqtt.username,
          mqtt_password: config.mqtt.password,
          tibber_enabled: config.tibber.enabled,
          tibber_api_key: config.tibber.apiKey,
          tibber_country: config.tibber.country,
          timezone: config.general.timezone
        })
      })
      
      if (response.ok) {
        if (onComplete) {
          onComplete(config)
        } else {
          window.location.href = '/'
        }
      } else {
        alert('Failed to save configuration')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Error saving configuration')
    }
  }

  const renderStepContent = () => {
    const step = steps[currentStep]
    
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <img src="https://carbonoz.com/assets/images/image04.jpg?v=8b5d1d9b" alt="CARBONOZ Logo" className="w-24 h-24 rounded-full object-cover" />
            </div>
            <div>
              <a href="https://carbonoz.com/" target="_blank" rel="noopener noreferrer" className="text-3xl font-bold text-gray-900 dark:text-white mb-4 hover:underline">
                Welcome to CARBONOZ SolarAutopilot
              </a>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Your intelligent AI-powered battery charging system. Let's configure your system 
                to start optimizing your solar energy usage and reducing your carbon footprint.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Wifi className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">MQTT Setup</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Connect to your message broker</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Dynamic Pricing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optional Tibber integration</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">General Config</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Timezone and regional settings</p>
              </div>
            </div>
          </div>
        )

      case 'mqtt':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">MQTT Broker Configuration</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configure your MQTT broker to enable communication with your solar system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Server className="w-4 h-4 inline mr-2" />
                  Broker Host *
                </label>
                <input
                  type="text"
                  value={config.mqtt.host}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    mqtt: { ...prev.mqtt, host: e.target.value }
                  }))}
                  placeholder="localhost or 192.168.1.100"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Port *
                </label>
                <input
                  type="number"
                  value={config.mqtt.port}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    mqtt: { ...prev.mqtt, port: parseInt(e.target.value) }
                  }))}
                  placeholder="1883"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Battery Number *
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.mqtt.batteryNumber}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    mqtt: { ...prev.mqtt, batteryNumber: parseInt(e.target.value) }
                  }))}
                  placeholder="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Inverter Number *
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.mqtt.inverterNumber}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    mqtt: { ...prev.mqtt, inverterNumber: parseInt(e.target.value) }
                  }))}
                  placeholder="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic Prefix *
                </label>
                <input
                  type="text"
                  value={config.mqtt.topicPrefix}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    mqtt: { ...prev.mqtt, topicPrefix: e.target.value }
                  }))}
                  placeholder="solar"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username (optional)
                </label>
                <input
                  type="text"
                  value={config.mqtt.username}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    mqtt: { ...prev.mqtt, username: e.target.value }
                  }))}
                  placeholder="mqtt_user"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password (optional)
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.mqtt ? "text" : "password"}
                    value={config.mqtt.password}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      mqtt: { ...prev.mqtt, password: e.target.value }
                    }))}
                    placeholder="mqtt_password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, mqtt: !prev.mqtt }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.mqtt ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'tibber':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tibber Integration</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enable dynamic pricing with Tibber (optional)
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="tibber-enabled"
                  checked={config.tibber.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    tibber: { ...prev.tibber, enabled: e.target.checked }
                  }))}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="tibber-enabled" className="text-lg font-medium text-gray-900 dark:text-white">
                  Enable Tibber Integration
                </label>
              </div>

              {config.tibber.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Key className="w-4 h-4 inline mr-2" />
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.tibber ? "text" : "password"}
                        value={config.tibber.apiKey}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          tibber: { ...prev.tibber, apiKey: e.target.value }
                        }))}
                        placeholder="Your Tibber API key"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, tibber: !prev.tibber }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.tibber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Country
                    </label>
                    <select
                      value={config.tibber.country}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        tibber: { ...prev.tibber, country: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    >
                      {zones.map(zone => (
                        <option key={zone.code} value={zone.code}>
                          {zone.zoneName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'general':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">General Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configure timezone and regional settings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={config.general.timezone}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    general: { ...prev.general, timezone: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Setup Complete!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Your CARBONOZ SolarAutopilot system is now configured and ready to optimize your solar energy usage.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Configuration Summary:</h3>
              <div className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>• MQTT Host: {config.mqtt.host}:{config.mqtt.port}</div>
                <div>• Topic Prefix: {config.mqtt.topicPrefix}</div>
                <div>• Battery #{config.mqtt.batteryNumber}, Inverter #{config.mqtt.inverterNumber}</div>
                <div>• Tibber: {config.tibber.enabled ? `Enabled (${config.tibber.country})` : 'Disabled'}</div>
                <div>• Timezone: {config.general.timezone}</div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return <AdvancedLoadingOverlay message="Initializing Setup..." isDark={false} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                  index <= currentStep
                    ? "text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )} style={index <= currentStep ? { backgroundColor: index < currentStep ? '#10B981' : '#DEAF0B' } : {}}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={clsx(
                    "w-16 h-1 mx-2",
                    index < currentStep ? "" : "bg-gray-200 dark:bg-gray-700"
                  )} style={index < currentStep ? { backgroundColor: '#10B981' } : {}} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {steps[currentStep].subtitle}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={clsx(
              "flex items-center px-6 py-3 rounded-lg font-medium transition-colors",
              currentStep === 0
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            )}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="flex items-center px-6 py-3 text-white rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#10B981' }}
            >
              <Save className="w-5 h-5 mr-2" />
              Save & Complete
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={clsx(
                "flex items-center px-6 py-3 rounded-lg font-medium transition-colors",
                canProceed()
                  ? "text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
              style={canProceed() ? { backgroundColor: '#DEAF0B' } : {}}
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}