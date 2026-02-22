import React, { useState, useEffect } from 'react'
import { Leaf, Zap, Sun, Home, TrendingUp, TrendingDown, AlertTriangle, Battery } from 'lucide-react'
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
  const [inverterWarning, setInverterWarning] = useState(null)
  const [batteryWarning, setBatteryWarning] = useState(null)
  const [iframeKey, setIframeKey] = useState(0)
  const [grafanaUrl, setGrafanaUrl] = useState('http://localhost:3001')
  const [headerVisible, setHeaderVisible] = useState(true)
  const { isLoading: pageLoading } = usePageLoading(800, 1500)
  const { isDark } = useTheme()

  // Auto-hide welcome header after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(false), 20000)
    return () => clearTimeout(timer)
  }, [])

  // Update Grafana iframes when dark mode changes
  const updateGrafanaIframes = (isDarkMode) => {
    setTimeout(() => {
      const iframes = document.querySelectorAll('iframe')
      iframes.forEach(iframe => {
        let src = iframe.src
        src = src.replace(/([?&]theme=)(light|dark)/, '')
        const separator = src.includes('?') ? '&' : '?'
        iframe.src = `${src}${separator}theme=${isDarkMode ? 'dark' : 'light'}&t=${Date.now()}`
      })
    }, 200)
  }

  useEffect(() => {
    updateGrafanaIframes(isDark)
  }, [isDark])

  useEffect(() => {
    fetch('/api/grafana/url')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.url) setGrafanaUrl(data.url)
      })
      .catch(err => console.error('Failed to fetch Grafana URL:', err))

    fetchSystemData()
    const interval = setInterval(fetchSystemData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSystemData = async () => {
    try {
      const [systemResponse, todayResponse] = await Promise.all([
        fetch('/api/system-state'),
        fetch('/api/results/data?period=today')
      ])

      const systemResult = await systemResponse.json()
      const todayResult = await todayResponse.json()

      let todayData = {
        date: format(new Date(), 'yyyy-MM-dd'),
        avoidedEmissions: 0,
        unavoidableEmissions: 0,
        selfSufficiencyScore: 0,
        gridEnergy: 0,
        solarEnergy: 0,
        carbonIntensity: 0
      }

      if (todayResult.success && todayResult.data.length > 0) {
        const data = todayResult.data[0]
        todayData = {
          date: data.date,
          avoidedEmissions: data.avoidedEmissions || 0,
          unavoidableEmissions: data.unavoidableEmissions || 0,
          selfSufficiencyScore: data.selfSufficiencyScore || 0,
          gridEnergy: data.gridEnergy || 0,
          solarEnergy: data.solarEnergy || 0,
          carbonIntensity: data.carbonIntensity || 0
        }
      }

      // Extract inverter & battery warnings from system state
      const state = systemResult.current_state || {}
      setInverterWarning(state.inverter_warning || null)
      setBatteryWarning(state.battery_warning || null)
      setWarnings(state.warnings || [])

      setSystemData(prev => ({
        ...prev,
        todayData,
        systemState: state
      }))

      setLoading(false)
    } catch (error) {
      console.error('Error fetching system data:', error)
      setLoading(false)
    }
  }

  // ── Reusable: Grafana iframe card ──────────────────────────────────────────
  const GrafanaCard = ({
    icon: Icon,
    iconColor,
    title,
    panelId,
    dashboardId = 'solar_power_dashboard/solar-power-dashboard',
    height = 'h-48',
    refresh = '5s'
  }) => (
    <div className="card p-0 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Icon className={clsx('w-5 h-5', iconColor)} />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
        </div>
      </div>
      <iframe
        key={`${panelId}-${iframeKey}`}
        src={`${grafanaUrl}/d-solo/${dashboardId}?orgId=1&refresh=${refresh}&panelId=${panelId}&theme=${isDark ? 'dark' : 'light'}&kiosk=tv`}
        className={clsx('w-full border-0', height)}
        title={title}
      />
    </div>
  )

  // ── Reusable: Metric stat card ─────────────────────────────────────────────
  const MetricCard = ({ icon: Icon, title, subtitle, value, trend, trendValue, color, progress, progressMax = 100 }) => (
    <div className="card group hover:scale-105 transition-transform duration-200">
      <div className="card-header">
        <div className={clsx('card-icon', `bg-${color}-500/20`)}>
          <Icon className={clsx('w-6 h-6', `text-${color}-500`)} />
        </div>
        <div>
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
        {trend && (
          <div className={clsx('flex items-center text-sm font-medium',
            trend === 'up' ? 'text-green-600' : 'text-red-500'
          )}>
            {trend === 'up'
              ? <TrendingUp className="w-4 h-4 mr-1" />
              : <TrendingDown className="w-4 h-4 mr-1" />}
            {trendValue}
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div className="space-y-1">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all duration-1000', `bg-${color}-500`)}
              style={{ width: `${Math.min(100, (progress / progressMax) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>{progressMax === 100 ? '100%' : progressMax.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  )

  if (pageLoading || loading) {
    return <AdvancedLoadingOverlay message="Loading energy dashboard..." isDark={isDark} />
  }

  const { todayData, summaryData } = systemData
  const weeklyAvgAvoided    = summaryData.month.avoidedEmissions / 4 || 1
  const weeklyAvgUnavoidable = summaryData.month.unavoidableEmissions / 4 || 1
  const emissionsMax = (todayData.avoidedEmissions + todayData.unavoidableEmissions) * 1.5 || 1

  const avoidedTrendUp     = summaryData.week.avoidedEmissions > weeklyAvgAvoided
  const unavoidableTrendDown = summaryData.week.unavoidableEmissions < weeklyAvgUnavoidable
  const selfTrendUp        = todayData.selfSufficiencyScore > summaryData.week.selfSufficiencyScore

  const avoidedTrendPct    = ((Math.abs(summaryData.week.avoidedEmissions - weeklyAvgAvoided) / weeklyAvgAvoided) * 100).toFixed(1)
  const unavoidableTrendPct = ((Math.abs(summaryData.week.unavoidableEmissions - weeklyAvgUnavoidable) / weeklyAvgUnavoidable) * 100).toFixed(1)
  const selfTrendPct       = Math.abs(todayData.selfSufficiencyScore - summaryData.week.selfSufficiencyScore).toFixed(1)

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Welcome Header (auto-hides after 20s) ─────────────────────────── */}
      <div className={clsx(
        'transition-all duration-500 overflow-hidden',
        headerVisible ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      )}>
        <div className="bg-gradient-to-r from-[#DEAF0B] to-[#c49a0a] rounded-2xl p-8 text-black relative">
          <button
            onClick={() => setHeaderVisible(false)}
            className="absolute top-4 right-4 text-black/50 hover:text-black text-xs bg-black/10 hover:bg-black/20 px-3 py-1 rounded-full transition-colors"
          >
            dismiss
          </button>
          <div className="flex items-center mb-3">
            <Sun className="w-8 h-8 text-black mr-3" />
            <h1 className="text-3xl font-bold">Welcome to SolarAutopilot</h1>
          </div>
          <p className="text-black/80 text-lg">
            Your solar energy dashboard for {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* ── Inverter & Battery Warnings ──────────────────────────────────── */}
      {(inverterWarning || batteryWarning) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">System Warnings</h3>
          </div>
          <div className="space-y-2">
            {inverterWarning && (
              <p className="text-yellow-700 dark:text-yellow-300">
                <strong>Inverter Warning:</strong> {inverterWarning}
              </p>
            )}
            {batteryWarning && (
              <p className="text-yellow-700 dark:text-yellow-300">
                <strong>Battery Warning:</strong> {batteryWarning}
              </p>
            )}
          </div>
        </div>
      )}



      {/* ── Live Power & Voltage Monitoring — full Grafana dashboard ────────── */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Live Power Monitoring</span>
          </div>
        </div>
        <iframe
          key={`live-power-${iframeKey}`}
          src={`${grafanaUrl}/d/solar_power_dashboard/solar_power_dashboard?orgId=1&kiosk=1&refresh=1s&theme=${isDark ? 'dark' : 'light'}`}
          className="w-full border-0"
          style={{ height: '520px' }}
          title="Solar Power Dashboard"
        />
      </div>

      {/* ── Emission & Efficiency Metrics ────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Emissions &amp; Efficiency</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MetricCard
            icon={Leaf}
            title="Emissions Avoided"
            subtitle="Today's solar contribution"
            value={`${todayData.avoidedEmissions.toFixed(2)} kg`}
            trend={avoidedTrendUp ? 'up' : 'down'}
            trendValue={`${avoidedTrendPct}% vs weekly average`}
            color="green"
            progress={todayData.avoidedEmissions}
            progressMax={emissionsMax}
          />
          <MetricCard
            icon={Zap}
            title="Emitted CO₂"
            subtitle="Today's grid consumption"
            value={`${todayData.unavoidableEmissions.toFixed(2)} kg`}
            trend={unavoidableTrendDown ? 'up' : 'down'}
            trendValue={`${unavoidableTrendPct}% vs weekly average`}
            color="red"
            progress={todayData.unavoidableEmissions}
            progressMax={emissionsMax}
          />
          <MetricCard
            icon={Sun}
            title="Self-Sufficiency"
            subtitle="Energy independence score"
            value={`${todayData.selfSufficiencyScore.toFixed(1)}%`}
            trend={selfTrendUp ? 'up' : 'down'}
            trendValue={`${selfTrendPct}% vs weekly average`}
            color="blue"
            progress={todayData.selfSufficiencyScore}
            progressMax={100}
          />
        </div>
      </div>

      {/* ── System Overview panel (solar_dashboard panelId=2) ────────────── */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">System Overview</span>
          </div>
        </div>
        <iframe
          key={`system-overview-${iframeKey}`}
          src={`${grafanaUrl}/d-solo/solar_dashboard?orgId=1&refresh=1m&panelId=2&theme=${isDark ? 'dark' : 'light'}`}
          className="w-full h-64 border-0"
          title="System Overview"
        />
      </div>

      {/* ── Battery Time-Series Charts (panelId 116, 139, 135) ───────────── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Battery Time-Series</h2>
        <div className="space-y-6">
          <GrafanaCard
            icon={Battery}
            iconColor="text-blue-500"
            title="Battery Power"
            panelId={116}
            dashboardId="solar_dashboard/charts"
            height="h-96"
            refresh="5s"
          />
          <GrafanaCard
            icon={Battery}
            iconColor="text-green-500"
            title="Battery State of Charge"
            panelId={139}
            dashboardId="solar_dashboard/charts"
            height="h-96"
            refresh="5s"
          />
          <GrafanaCard
            icon={Battery}
            iconColor="text-indigo-500"
            title="Battery Voltage History"
            panelId={135}
            dashboardId="solar_dashboard/charts"
            height="h-96"
            refresh="5s"
          />
        </div>
      </div>

      {/* ── General Warnings array ───────────────────────────────────────── */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">System Warnings</h3>
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