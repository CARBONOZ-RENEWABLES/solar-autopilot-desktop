import { useState, useEffect } from 'react'

export function useConfigCheck() {
  const [isConfigured, setIsConfigured] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      console.log('Checking configuration...')
      const response = await fetch('/api/config/check')
      const data = await response.json()
      console.log('Config check response:', data)
      
      if (data.success) {
        const config = data.config
        const requiredFields = ['inverter_number', 'battery_number', 'mqtt_topic_prefix', 'mqtt_host', 'mqtt_port']
        const isComplete = requiredFields.every(field => config[field] && config[field].toString().trim() !== '')
        console.log('Configuration complete:', isComplete)
        setIsConfigured(isComplete)
      } else {
        setIsConfigured(false)
      }
    } catch (error) {
      console.error('Error checking configuration:', error)
      setIsConfigured(false)
    } finally {
      setLoading(false)
    }
  }

  return { isConfigured, loading, checkConfiguration }
}