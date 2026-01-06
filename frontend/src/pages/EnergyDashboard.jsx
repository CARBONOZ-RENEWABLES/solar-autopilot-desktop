import React, { useState, useEffect } from 'react'
import { Leaf, Zap, Sun, Home, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'
import AdvancedLoadingOverlay from '../components/AdvancedLoadingOverlay'
import { usePageLoading } from '../hooks/useLoading'
import { useTheme } from '../hooks/useTheme'

export default function EnergyDashboard() {
  const [systemData, setSystemData] = useState({
    todayData: {
      date: format(new Date(), 'yyyy-MM-dd'),
      avoidedEmissions: 0,
      unavoidableEmissions: 0,
      selfSufficiencyScore: 0,
      gridEnergy: 0,
      solarEnergy: 0,
      carbonIntensity: 0
    },
    summaryData: {
      week: { avoidedEmissions: 0, unavoidableEmissions: 0, selfSufficiencyScore: 0 },
      month: { avoidedEmissions: 0, unavoidableEmissions: 0, selfSufficiencyScore: 0 }
    },
    systemState: {
      battery_soc: 0,
      pv_power: 0,
      grid_power: 0,
      load: 0,
      battery_power: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [warnings, setWarnings] = useState([])
  const { isLoading: pageLoading } = usePageLoading(800, 1500)
  const { isDark } = useTheme()

  useEffect(() => {
    fetchSystemData()
    const interval = setInterval(fetchSystemData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemData = async () => {
    try {
      // Fetch system state
      const systemResponse = await fetch('/api/system-state')
      const systemData = await systemResponse.json()
      
      if (systemData.current_state) {
        setSystemData(prev => ({
          ...prev,
          systemState: systemData.current_state
        }))
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching system data:', error)
      setLoading(false)
    }
  }

  const MetricCard = ({ icon: Icon, title, subtitle, value, trend, trendValue, color, progress }) => (
    <div className="card group hover:scale-105 transition-transform duration-200">
      <div className="card-header">
        <div className={clsx('card-icon', `bg-${color}-500`)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">{subtitle}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {value}
        </div>
        {trend && (
          <div className={clsx('flex items-center text-sm', 
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {trendValue}
          </div>
        )}
      </div>
      
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="progress-bar">
            <div 
              className={clsx('progress-fill', `bg-${color}-500`)}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  )

  const SystemStateCard = ({ icon: Icon, label, value, unit, color }) => (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon className={clsx('w-5 h-5 mr-2', `text-${color}-500`)} />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}{unit}
      </div>
    </div>
  )

  if (pageLoading || loading) {
    return <AdvancedLoadingOverlay message="Loading energy dashboard..." isDark={isDark} />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to SolarAutopilot</h1>
        <p className="text-primary-100 text-lg">
          Your solar energy dashboard for {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </div>

      {/* System State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <SystemStateCard
          icon={Zap}
          label="Battery Level"
          value={systemData.systemState.battery_soc || 0}
          unit="%"
          color="blue"
        />
        <SystemStateCard
          icon={Sun}
          label="Solar Power"
          value={(systemData.systemState.pv_power || 0).toFixed(0)}
          unit="W"
          color="yellow"
        />
        <SystemStateCard
          icon={Zap}
          label="Grid Power"
          value={(systemData.systemState.grid_power || 0).toFixed(0)}
          unit="W"
          color="purple"
        />
        <SystemStateCard
          icon={Home}
          label="Load Power"
          value={(systemData.systemState.load || 0).toFixed(0)}
          unit="W"
          color="green"
        />
        <SystemStateCard
          icon={Zap}
          label="Battery Power"
          value={(systemData.systemState.battery_power || 0).toFixed(0)}
          unit="W"
          color="indigo"
        />
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard
          icon={Leaf}
          title="Emissions Avoided"
          subtitle="Today's solar contribution"
          value={`${systemData.todayData.avoidedEmissions.toFixed(2)} kg`}
          trend="up"
          trendValue="12% vs weekly average"
          color="green"
          progress={75}
        />
        
        <MetricCard
          icon={Zap}
          title="Emitted CO₂"
          subtitle="Today's grid consumption"
          value={`${systemData.todayData.unavoidableEmissions.toFixed(2)} kg`}
          trend="down"
          trendValue="8% vs weekly average"
          color="red"
          progress={45}
        />
        
        <MetricCard
          icon={Sun}
          title="Self-Sufficiency"
          subtitle="Energy independence score"
          value={`${systemData.todayData.selfSufficiencyScore.toFixed(1)}%`}
          trend="up"
          trendValue="5% vs weekly average"
          color="blue"
          progress={systemData.todayData.selfSufficiencyScore}
        />
      </div>

      {/* Grafana Dashboard Embed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-0 overflow-hidden">
          <iframe
            src="http://localhost:3001/d/solar_power_dashboard/solar_power_dashboard?orgId=1&kiosk=1&refresh=1s&theme=light"
            className="w-full h-96 border-0"
            title="Solar Power Dashboard"
          />
        </div>
        
        <div className="card p-0 overflow-hidden">
          <iframe
            src="http://localhost:3001/d-solo/solar_dashboard?orgId=1&refresh=1m&panelId=2&theme=light"
            className="w-full h-96 border-0"
            title="Solar Overview"
          />
        </div>
      </div>

      {/* Battery Monitoring */}
      <div className="card p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-64">
          <iframe
            src="http://localhost:3001/d-solo/solar_dashboard?orgId=1&refresh=1m&panelId=116&theme=light"
            className="w-full h-full border-0"
            title="Battery SOC"
          />
          <iframe
            src="http://localhost:3001/d-solo/solar_dashboard?orgId=1&refresh=1m&panelId=139&theme=light"
            className="w-full h-full border-0"
            title="Battery Voltage"
          />
          <iframe
            src="http://localhost:3001/d-solo/solar_dashboard?orgId=1&refresh=1m&panelId=135&theme=light"
            className="w-full h-full border-0"
            title="Battery Current"
          />
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              System Warnings
            </h3>
          </div>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <p key={index} className="text-yellow-700 dark:text-yellow-300">
                <strong>{warning.type}:</strong> {warning.message}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}