import React, { useState } from 'react'
import { Settings, Save, Wifi, Server, Hash } from 'lucide-react'
import AdvancedLoadingOverlay from '../components/AdvancedLoadingOverlay'
import { useTheme } from '../hooks/useTheme'

export default function ConfigSetup({ onComplete }) {
  const [config, setConfig] = useState({
    inverter_number: '',
    battery_number: '',
    mqtt_topic_prefix: '',
    mqtt_host: '',
    mqtt_port: '1883',
    mqtt_username: '',
    mqtt_password: ''
  })
  const [saving, setSaving] = useState(false)
  const { isDark } = useTheme()

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/config/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        onComplete(config)
      }
    } catch (error) {
      console.error('Error saving configuration:', error)
    } finally {
      setSaving(false)
    }
  }

  const isValid = config.inverter_number && config.battery_number && config.mqtt_topic_prefix && config.mqtt_host && config.mqtt_port

  if (saving) {
    return <AdvancedLoadingOverlay message="Saving configuration..." isDark={isDark} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: isDark ? 'rgba(24, 27, 31, 1)' : '#f9fafb' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            CARBONOZ SolarAutopilot Setup
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Configure your system to get started
          </p>
        </div>

        <div className={`rounded-2xl p-8 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Hash className="w-4 h-4 inline mr-2" />
                  Inverter Number *
                </label>
                <input
                  type="text"
                  value={config.inverter_number}
                  onChange={(e) => setConfig(prev => ({ ...prev, inverter_number: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="e.g., 1"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Hash className="w-4 h-4 inline mr-2" />
                  Battery Number *
                </label>
                <input
                  type="text"
                  value={config.battery_number}
                  onChange={(e) => setConfig(prev => ({ ...prev, battery_number: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="e.g., 1"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Wifi className="w-4 h-4 inline mr-2" />
                MQTT Topic Prefix *
              </label>
              <input
                type="text"
                value={config.mqtt_topic_prefix}
                onChange={(e) => setConfig(prev => ({ ...prev, mqtt_topic_prefix: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                placeholder="e.g., solar"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Server className="w-4 h-4 inline mr-2" />
                  MQTT Host *
                </label>
                <input
                  type="text"
                  value={config.mqtt_host}
                  onChange={(e) => setConfig(prev => ({ ...prev, mqtt_host: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="e.g., localhost or 192.168.1.100"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  MQTT Port *
                </label>
                <input
                  type="number"
                  value={config.mqtt_port}
                  onChange={(e) => setConfig(prev => ({ ...prev, mqtt_port: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="1883"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  MQTT Username (Optional)
                </label>
                <input
                  type="text"
                  value={config.mqtt_username}
                  onChange={(e) => setConfig(prev => ({ ...prev, mqtt_username: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  MQTT Password (Optional)
                </label>
                <input
                  type="password"
                  value={config.mqtt_password}
                  onChange={(e) => setConfig(prev => ({ ...prev, mqtt_password: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={handleSave}
                disabled={!isValid}
                className="w-full bg-gradient-to-r from-yellow-400 to-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-yellow-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Configuration & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}