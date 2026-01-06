import React, { useState, useEffect } from 'react'
import { 
  Sun, 
  Battery, 
  Zap, 
  Download, 
  FileText, 
  Calendar,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import clsx from 'clsx'
import AdvancedLoadingOverlay from '../components/AdvancedLoadingOverlay'
import { usePageLoading } from '../hooks/useLoading'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Analytics() {
  const [data, setData] = useState({
    loadPowerData: [],
    pvPowerData: [],
    batteryStateOfChargeData: [],
    batteryPowerData: [],
    gridPowerData: [],
    gridVoltageData: [],
    loadPowerYear: [],
    pvPowerYear: [],
    batteryStateOfChargeYear: [],
    batteryPowerYear: [],
    gridPowerYear: [],
    gridVoltageYear: [],
    loadPowerDecade: [],
    pvPowerDecade: [],
    batteryStateOfChargeDecade: [],
    batteryPowerDecade: [],
    gridPowerDecade: [],
    gridVoltageDecade: [],
    selectedZone: null,
    carbonIntensityData: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30days')
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(25)
  const [monthlyData, setMonthlyData] = useState([])
  const [yearlyData, setYearlyData] = useState([])
  const { isLoading: pageLoading } = usePageLoading(700, 1400)
  const { isDark } = useTheme()

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      // Fetch all required data endpoints like EJS version
      const [loadPowerRes, pvPowerRes, batteryStateRes, batteryPowerRes, gridPowerRes, gridVoltageRes,
             loadPowerYearRes, pvPowerYearRes, batteryStateYearRes, batteryPowerYearRes, gridPowerYearRes, gridVoltageYearRes,
             loadPowerDecadeRes, pvPowerDecadeRes, batteryStateDecadeRes, batteryPowerDecadeRes, gridPowerDecadeRes, gridVoltageDecadeRes,
             carbonIntensityRes, settingsRes] = await Promise.all([
        fetch('/api/data/load-power').catch(() => ({ ok: false })),
        fetch('/api/data/pv-power').catch(() => ({ ok: false })),
        fetch('/api/data/battery-state-of-charge').catch(() => ({ ok: false })),
        fetch('/api/data/battery-power').catch(() => ({ ok: false })),
        fetch('/api/data/grid-power').catch(() => ({ ok: false })),
        fetch('/api/data/grid-voltage').catch(() => ({ ok: false })),
        fetch('/api/data/load-power-year').catch(() => ({ ok: false })),
        fetch('/api/data/pv-power-year').catch(() => ({ ok: false })),
        fetch('/api/data/battery-state-of-charge-year').catch(() => ({ ok: false })),
        fetch('/api/data/battery-power-year').catch(() => ({ ok: false })),
        fetch('/api/data/grid-power-year').catch(() => ({ ok: false })),
        fetch('/api/data/grid-voltage-year').catch(() => ({ ok: false })),
        fetch('/api/data/load-power-decade').catch(() => ({ ok: false })),
        fetch('/api/data/pv-power-decade').catch(() => ({ ok: false })),
        fetch('/api/data/battery-state-of-charge-decade').catch(() => ({ ok: false })),
        fetch('/api/data/battery-power-decade').catch(() => ({ ok: false })),
        fetch('/api/data/grid-power-decade').catch(() => ({ ok: false })),
        fetch('/api/data/grid-voltage-decade').catch(() => ({ ok: false })),
        fetch('/api/carbon-intensity').catch(() => ({ ok: false })),
        fetch('/api/settings').catch(() => ({ ok: false }))
      ])

      const analyticsData = {
        loadPowerData: loadPowerRes.ok ? await loadPowerRes.json() : generateSampleData(30, 'load'),
        pvPowerData: pvPowerRes.ok ? await pvPowerRes.json() : generateSampleData(30, 'pv'),
        batteryStateOfChargeData: batteryStateRes.ok ? await batteryStateRes.json() : generateSampleData(30, 'battery'),
        batteryPowerData: batteryPowerRes.ok ? await batteryPowerRes.json() : generateSampleData(30, 'batteryPower'),
        gridPowerData: gridPowerRes.ok ? await gridPowerRes.json() : generateSampleData(30, 'grid'),
        gridVoltageData: gridVoltageRes.ok ? await gridVoltageRes.json() : generateSampleData(30, 'gridVoltage'),
        loadPowerYear: loadPowerYearRes.ok ? await loadPowerYearRes.json() : generateSampleData(365, 'load'),
        pvPowerYear: pvPowerYearRes.ok ? await pvPowerYearRes.json() : generateSampleData(365, 'pv'),
        batteryStateOfChargeYear: batteryStateYearRes.ok ? await batteryStateYearRes.json() : generateSampleData(365, 'battery'),
        batteryPowerYear: batteryPowerYearRes.ok ? await batteryPowerYearRes.json() : generateSampleData(365, 'batteryPower'),
        gridPowerYear: gridPowerYearRes.ok ? await gridPowerYearRes.json() : generateSampleData(365, 'grid'),
        gridVoltageYear: gridVoltageYearRes.ok ? await gridVoltageYearRes.json() : generateSampleData(365, 'gridVoltage'),
        loadPowerDecade: loadPowerDecadeRes.ok ? await loadPowerDecadeRes.json() : generateSampleData(3650, 'load'),
        pvPowerDecade: pvPowerDecadeRes.ok ? await pvPowerDecadeRes.json() : generateSampleData(3650, 'pv'),
        batteryStateOfChargeDecade: batteryStateDecadeRes.ok ? await batteryStateDecadeRes.json() : generateSampleData(3650, 'battery'),
        batteryPowerDecade: batteryPowerDecadeRes.ok ? await batteryPowerDecadeRes.json() : generateSampleData(3650, 'batteryPower'),
        gridPowerDecade: gridPowerDecadeRes.ok ? await gridPowerDecadeRes.json() : generateSampleData(3650, 'grid'),
        gridVoltageDecade: gridVoltageDecadeRes.ok ? await gridVoltageDecadeRes.json() : generateSampleData(3650, 'gridVoltage'),
        carbonIntensityData: carbonIntensityRes.ok ? await carbonIntensityRes.json() : generateCarbonData(365),
        selectedZone: 'DE'
      }

      // Get selected zone from settings
      if (settingsRes.ok) {
        const settings = await settingsRes.json()
        analyticsData.selectedZone = settings.selectedZone || 'DE'
      }

      setData(analyticsData)
      
      // Process monthly and yearly data
      const dailyValues = calculateDailyValues(
        analyticsData.loadPowerYear,
        analyticsData.pvPowerYear,
        analyticsData.batteryStateOfChargeYear,
        analyticsData.batteryPowerYear,
        analyticsData.gridPowerYear,
        analyticsData.gridVoltageYear
      )
      
      const monthlyProcessed = aggregateMonthlyData(dailyValues)
      const yearlyProcessed = aggregateYearlyData(dailyValues)
      
      setMonthlyData(monthlyProcessed)
      setYearlyData(yearlyProcessed)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setLoading(false)
    }
  }



  const generateSampleData = (days, type) => {
    const data = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      let value = 0
      switch (type) {
        case 'load':
          value = Math.random() * 50 + 20
          break
        case 'pv':
          value = Math.random() * 40 + 10
          break
        case 'battery':
          value = Math.random() * 20 + 5
          break
        case 'batteryPower':
          value = Math.random() * 15 + 3
          break
        case 'grid':
          value = Math.random() * 30 + 5
          break
        case 'gridVoltage':
          value = Math.random() * 25 + 2
          break
        default:
          value = Math.random() * 100
      }
      
      data.push({
        time: date.toISOString(),
        value: value.toString()
      })
    }
    
    return data
  }

  const generateCarbonData = (days) => {
    const data = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        carbonIntensity: Math.random() * 200 + 150
      })
    }
    
    return data
  }

  const calculateSummaryStats = () => {
    // Process the last 30 days of data similar to EJS logic
    const processedData = calculateDailyValues(
      data.loadPowerData,
      data.pvPowerData,
      data.batteryStateOfChargeData,
      data.batteryPowerData,
      data.gridPowerData,
      data.gridVoltageData
    )
    
    const today = processedData.length > 0 ? processedData[processedData.length - 1] : { pv: 0 }
    const last7Days = processedData.slice(-7)
    const last30Days = processedData.slice(-30)
    
    return {
      today: today.pv || 0,
      week: last7Days.reduce((sum, d) => sum + (d.pv || 0), 0),
      month: last30Days.reduce((sum, d) => sum + (d.pv || 0), 0)
    }
  }

  const calculateDailyValues = (loadData, pvData, batteryChargedData, batteryDischargedData, gridUsedData, gridExportedData) => {
    const dailyResults = []
    
    const dataLength = Math.min(
      loadData.length,
      pvData.length,
      batteryChargedData.length,
      batteryDischargedData.length,
      gridUsedData.length,
      gridExportedData.length
    )
    
    for (let i = 1; i < dataLength; i++) {
      const currentLoad = parseFloat(loadData[i]?.value) || 0
      const previousLoad = parseFloat(loadData[i - 1]?.value) || 0
      
      const currentPV = parseFloat(pvData[i]?.value) || 0
      const previousPV = parseFloat(pvData[i - 1]?.value) || 0
      
      const currentBatteryCharged = parseFloat(batteryChargedData[i]?.value) || 0
      const previousBatteryCharged = parseFloat(batteryChargedData[i - 1]?.value) || 0
      
      const currentBatteryDischarged = parseFloat(batteryDischargedData[i]?.value) || 0
      const previousBatteryDischarged = parseFloat(batteryDischargedData[i - 1]?.value) || 0
      
      const currentGridUsed = parseFloat(gridUsedData[i]?.value) || 0
      const previousGridUsed = parseFloat(gridUsedData[i - 1]?.value) || 0
      
      const currentGridExported = parseFloat(gridExportedData[i]?.value) || 0
      const previousGridExported = parseFloat(gridExportedData[i - 1]?.value) || 0
      
      // Check if all values for current day are greater than previous day
      const allGreater = 
        (previousLoad === 0 || currentLoad > previousLoad) &&
        (previousPV === 0 || currentPV > previousPV) &&
        (previousBatteryCharged === 0 || currentBatteryCharged > previousBatteryCharged) &&
        (previousBatteryDischarged === 0 || currentBatteryDischarged > previousBatteryDischarged) &&
        (previousGridUsed === 0 || currentGridUsed > previousGridUsed) &&
        (previousGridExported === 0 || currentGridExported > previousGridExported)
      
      const time = loadData[i].time
      const date = new Date(time).toISOString().split('T')[0]
      
      if (allGreater) {
        // Calculate differences
        dailyResults.push({
          date,
          load: currentLoad - previousLoad,
          pv: currentPV - previousPV,
          batteryCharged: currentBatteryCharged - previousBatteryCharged,
          batteryDischarged: currentBatteryDischarged - previousBatteryDischarged,
          gridUsed: currentGridUsed - previousGridUsed,
          gridExported: currentGridExported - previousGridExported
        })
      } else {
        // Use current values
        dailyResults.push({
          date,
          load: currentLoad,
          pv: currentPV,
          batteryCharged: currentBatteryCharged,
          batteryDischarged: currentBatteryDischarged,
          gridUsed: currentGridUsed,
          gridExported: currentGridExported
        })
      }
    }
    
    return dailyResults
  }

  const aggregateMonthlyData = (dailyValues) => {
    const monthlyData = {}
    
    dailyValues.forEach(entry => {
      const date = new Date(entry.date)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          date: new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0],
          load: 0,
          pv: 0,
          batteryCharged: 0,
          batteryDischarged: 0,
          gridUsed: 0,
          gridExported: 0
        }
      }
      
      monthlyData[monthKey].load += entry.load || 0
      monthlyData[monthKey].pv += entry.pv || 0
      monthlyData[monthKey].batteryCharged += entry.batteryCharged || 0
      monthlyData[monthKey].batteryDischarged += entry.batteryDischarged || 0
      monthlyData[monthKey].gridUsed += entry.gridUsed || 0
      monthlyData[monthKey].gridExported += entry.gridExported || 0
    })
    
    return Object.values(monthlyData).sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const aggregateYearlyData = (dailyValues) => {
    const yearlyData = {}
    
    dailyValues.forEach(entry => {
      const date = new Date(entry.date)
      const yearKey = date.getFullYear()
      
      if (!yearlyData[yearKey]) {
        yearlyData[yearKey] = {
          date: new Date(date.getFullYear(), 0, 1).toISOString().split('T')[0],
          load: 0,
          pv: 0,
          batteryCharged: 0,
          batteryDischarged: 0,
          gridUsed: 0,
          gridExported: 0
        }
      }
      
      yearlyData[yearKey].load += entry.load || 0
      yearlyData[yearKey].pv += entry.pv || 0
      yearlyData[yearKey].batteryCharged += entry.batteryCharged || 0
      yearlyData[yearKey].batteryDischarged += entry.batteryDischarged || 0
      yearlyData[yearKey].gridUsed += entry.gridUsed || 0
      yearlyData[yearKey].gridExported += entry.gridExported || 0
    })
    
    return Object.values(yearlyData).sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const SolarCard = ({ title, value, icon: Icon, color, period }) => (
    <div className={clsx('card hover:scale-105 transition-transform duration-200', `border-l-4 border-${color}-500`)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center mr-4', `bg-${color}-100 dark:bg-${color}-900`)}>
            <Icon className={clsx('w-6 h-6', `text-${color}-600 dark:text-${color}-400`)} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{period}</p>
          </div>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {value.toFixed(1)} kWh
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={clsx('h-2 rounded-full', `bg-${color}-500`)}
          style={{ width: `${Math.min(100, (value / Math.max(value * 1.2, 10)) * 100)}%` }}
        />
      </div>
    </div>
  )

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={clsx('card', className)}>
      <div className="flex items-center mb-6">
        <BarChart3 className="w-5 h-5 mr-2 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="h-80">
        {children}
      </div>
    </div>
  )

  const getChartOptions = (title, yAxisLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#1e293b',
          font: { size: 12, weight: '500' }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#DEAF0B',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#DEAF0B',
          font: { weight: '500' }
        }
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#DEAF0B',
          font: { weight: '500' }
        },
        title: {
          display: true,
          text: yAxisLabel,
          color: '#DEAF0B',
          font: { size: 13, weight: '600' }
        }
      }
    }
  })

  const exportToCSV = (period = '30days') => {
    let dataToExport, filename
    
    switch (period) {
      case '12months':
        dataToExport = monthlyData
        filename = `analytics-12months-${new Date().toISOString().split('T')[0]}.csv`
        break
      case '10years':
        dataToExport = yearlyData
        filename = `analytics-10years-${new Date().toISOString().split('T')[0]}.csv`
        break
      default:
        dataToExport = calculateDailyValues(
          data.loadPowerData,
          data.pvPowerData,
          data.batteryStateOfChargeData,
          data.batteryPowerData,
          data.gridPowerData,
          data.gridVoltageData
        )
        filename = `analytics-30days-${new Date().toISOString().split('T')[0]}.csv`
    }

    let csv = 'Date,Load (kWh),Solar PV (kWh),Battery Charged (kWh),Battery Discharged (kWh),Grid Used (kWh),Grid Exported (kWh)'
    
    if (data.selectedZone) {
      csv += ',CO2 Avoided (kg),CO2 Emitted (kg)'
    }
    csv += '\n'
    
    dataToExport.forEach(row => {
      const displayDate = period === '10years' 
        ? new Date(row.date).getFullYear()
        : period === '12months'
        ? new Date(row.date).toLocaleString('default', { month: 'long', year: 'numeric' })
        : new Date(row.date).toLocaleDateString('en-GB')
        
      let line = `${displayDate},${row.load.toFixed(2)},${row.pv.toFixed(2)},${row.batteryCharged.toFixed(2)},${row.batteryDischarged.toFixed(2)},${row.gridUsed.toFixed(2)},${row.gridExported.toFixed(2)}`
      
      if (data.selectedZone && data.carbonIntensityData.length > 0) {
        const carbonData = data.carbonIntensityData.find(d => d.date === row.date)
        const carbonIntensity = carbonData?.carbonIntensity || 0
        const co2Avoided = row.pv * carbonIntensity / 1000
        const co2Emitted = row.gridUsed * carbonIntensity / 1000
        line += `,${co2Avoided.toFixed(2)},${co2Emitted.toFixed(2)}`
      }
      
      csv += line + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = async (period = '30days') => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('CARBONOZ SolarAutopilot Analytics', 20, 30)
    
    doc.setFontSize(14)
    doc.text(`Period: ${period}`, 20, 45)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55)
    
    const stats = calculateSummaryStats()
    doc.setFontSize(12)
    doc.text('Summary Statistics:', 20, 75)
    doc.text(`Today's Solar: ${stats.today.toFixed(2)} kWh`, 30, 85)
    doc.text(`Weekly Solar: ${stats.week.toFixed(2)} kWh`, 30, 95)
    doc.text(`Monthly Solar: ${stats.month.toFixed(2)} kWh`, 30, 105)
    
    doc.save(`analytics-${period}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  if (pageLoading || loading) {
    return <AdvancedLoadingOverlay message="Loading analytics data..." isDark={isDark} />
  }

  const stats = calculateSummaryStats()
  const processedData = calculateDailyValues(
    data.loadPowerData,
    data.pvPowerData,
    data.batteryStateOfChargeData,
    data.batteryPowerData,
    data.gridPowerData,
    data.gridVoltageData
  )

  // Sample chart data - replace with actual data processing
  const energyOverviewData = {
    labels: processedData.slice(-30).map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Solar PV',
        data: processedData.slice(-30).map(d => d.pv || 0),
        borderColor: '#FFA500',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Load',
        data: processedData.slice(-30).map(d => d.load || 0),
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Grid Used',
        data: processedData.slice(-30).map(d => d.gridUsed || 0),
        borderColor: '#9C27B0',
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Grid Exported',
        data: processedData.slice(-30).map(d => -(d.gridExported || 0)),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  }

  const batteryData = {
    labels: processedData.slice(-30).map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Battery Charged',
        data: processedData.slice(-30).map(d => -(d.batteryCharged || 0)),
        backgroundColor: '#0C7085',
        stack: 'battery'
      },
      {
        label: 'Battery Discharged',
        data: processedData.slice(-30).map(d => d.batteryDischarged || 0),
        backgroundColor: '#FF8DA1',
        stack: 'battery'
      }
    ]
  }

  const gridData = {
    labels: processedData.slice(-30).map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Grid Exported',
        data: processedData.slice(-30).map(d => -(d.gridExported || 0)),
        backgroundColor: '#4CAF50',
        stack: 'grid'
      },
      {
        label: 'Grid Used',
        data: processedData.slice(-30).map(d => d.gridUsed || 0),
        backgroundColor: '#9C27B0',
        stack: 'grid'
      }
    ]
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive energy analysis and reporting
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => exportToCSV('30days')}
            className="btn btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => exportToPDF('30days')}
            className="btn btn-secondary"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Solar PV Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SolarCard
          title="Today's Solar PV"
          value={stats.today}
          icon={Sun}
          color="yellow"
          period="Current Day Production"
        />
        <SolarCard
          title="Last 7 Days Solar PV"
          value={stats.week}
          icon={Calendar}
          color="green"
          period="Weekly Production Total"
        />
        <SolarCard
          title="Last 30 Days Solar PV"
          value={stats.month}
          icon={TrendingUp}
          color="blue"
          period="Monthly Production Total"
        />
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <ChartCard title="Energy Overview - Last 30 Days">
          <Line data={energyOverviewData} options={getChartOptions('Energy Overview', 'kWh')} />
        </ChartCard>

        <ChartCard title="Battery Charge/Discharge - Last 30 Days">
          <Bar data={batteryData} options={getChartOptions('Battery Activity', 'kWh')} />
        </ChartCard>

        <ChartCard title="Grid Used/Exported - Last 30 Days">
          <Bar data={gridData} options={getChartOptions('Grid Activity', 'kWh')} />
        </ChartCard>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Last 30 Days Data
            {data.selectedZone && (
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                (Showing CO2 data for zone: {data.selectedZone})
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="ml-2 mr-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              entries
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Load</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Solar PV</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Battery Charged</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Battery Discharged</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Grid Used</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Grid Exported</th>
                {data.selectedZone && (
                  <>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">CO2 Avoided</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">CO2 Emitted</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {processedData.slice(-entriesPerPage).reverse().map((row, index) => {
                let co2Avoided = 0, co2Emitted = 0
                if (data.selectedZone && data.carbonIntensityData.length > 0) {
                  const carbonData = data.carbonIntensityData.find(d => d.date === row.date)
                  const carbonIntensity = carbonData?.carbonIntensity || 0
                  co2Avoided = row.pv * carbonIntensity / 1000
                  co2Emitted = row.gridUsed * carbonIntensity / 1000
                }
                
                return (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">{new Date(row.date).toLocaleDateString('en-GB')}</td>
                    <td className="py-3 px-4">{row.load.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.pv.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.batteryCharged.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.batteryDischarged.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.gridUsed.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.gridExported.toFixed(1)} kWh</td>
                    {data.selectedZone && (
                      <>
                        <td className="py-3 px-4">{co2Avoided.toFixed(2)} kg</td>
                        <td className="py-3 px-4">{co2Emitted.toFixed(2)} kg</td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {Math.min(entriesPerPage, processedData.length)} of {processedData.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(processedData.length / entriesPerPage)}
              className="btn btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => exportToCSV('30days')}
            className="btn btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            📄 CSV
          </button>
          <button
            onClick={() => exportToPDF('30days')}
            className="btn btn-secondary"
          >
            <FileText className="w-4 h-4 mr-2" />
            📋 PDF
          </button>
        </div>
      </div>

      {/* 12 Months Chart */}
      <ChartCard title="Energy Overview - Last 12 Months">
        <Line 
          data={{
            labels: monthlyData.slice(-12).reverse().map(d => new Date(d.date).toLocaleString('default', { month: 'short', year: 'numeric' })),
            datasets: [
              {
                label: 'Solar PV',
                data: monthlyData.slice(-12).reverse().map(d => d.pv || 0),
                borderColor: '#FFA500',
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'Load',
                data: monthlyData.slice(-12).reverse().map(d => d.load || 0),
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.2)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'Grid Used',
                data: monthlyData.slice(-12).reverse().map(d => d.gridUsed || 0),
                borderColor: '#9C27B0',
                backgroundColor: 'rgba(156, 39, 176, 0.2)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'Grid Exported',
                data: monthlyData.slice(-12).reverse().map(d => -(d.gridExported || 0)),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
                tension: 0.3
              }
            ]
          }} 
          options={getChartOptions('Energy Overview', 'kWh')} 
        />
      </ChartCard>

      {/* 12 Months Data Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Last 12 Months Data
            {data.selectedZone && (
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                (Showing CO2 data for zone: {data.selectedZone})
              </span>
            )}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Month</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Load</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Solar PV</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Battery Charged</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Battery Discharged</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Grid Used</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Grid Exported</th>
                {data.selectedZone && (
                  <>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">CO2 Avoided</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">CO2 Emitted</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {monthlyData.slice(0, 12).map((row, index) => {
                let co2Avoided = 0, co2Emitted = 0
                if (data.selectedZone && data.carbonIntensityData.length > 0) {
                  const date = new Date(row.date)
                  const monthCarbonIntensity = data.carbonIntensityData
                    .filter(d => {
                      const carbonDate = new Date(d.date)
                      return carbonDate.getMonth() === date.getMonth() && carbonDate.getFullYear() === date.getFullYear()
                    })
                    .reduce((acc, curr, _, arr) => acc + curr.carbonIntensity / arr.length, 0)
                  
                  co2Avoided = row.pv * monthCarbonIntensity / 1000
                  co2Emitted = row.gridUsed * monthCarbonIntensity / 1000
                }
                
                return (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">{new Date(row.date).toLocaleString('default', { month: 'long', year: 'numeric' })}</td>
                    <td className="py-3 px-4">{row.load.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.pv.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.batteryCharged.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.batteryDischarged.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.gridUsed.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.gridExported.toFixed(1)} kWh</td>
                    {data.selectedZone && (
                      <>
                        <td className="py-3 px-4">{co2Avoided.toFixed(2)} kg</td>
                        <td className="py-3 px-4">{co2Emitted.toFixed(2)} kg</td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => exportToCSV('12months')}
            className="btn btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            📄 CSV
          </button>
          <button
            onClick={() => exportToPDF('12months')}
            className="btn btn-secondary"
          >
            <FileText className="w-4 h-4 mr-2" />
            📋 PDF
          </button>
        </div>
      </div>

      {/* 10 Years Chart */}
      <ChartCard title="Energy Overview - Last 10 Years">
        <Line 
          data={{
            labels: yearlyData.slice(-10).reverse().map(d => new Date(d.date).getFullYear()),
            datasets: [
              {
                label: 'Solar PV',
                data: yearlyData.slice(-10).reverse().map(d => d.pv || 0),
                borderColor: '#FFA500',
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'Load',
                data: yearlyData.slice(-10).reverse().map(d => d.load || 0),
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.2)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'Grid Used',
                data: yearlyData.slice(-10).reverse().map(d => d.gridUsed || 0),
                borderColor: '#9C27B0',
                backgroundColor: 'rgba(156, 39, 176, 0.2)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'Grid Exported',
                data: yearlyData.slice(-10).reverse().map(d => -(d.gridExported || 0)),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true,
                tension: 0.3
              }
            ]
          }} 
          options={getChartOptions('Energy Overview', 'kWh')} 
        />
      </ChartCard>

      {/* 10 Years Data Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Last 10 Years Data
            {data.selectedZone && (
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                (Showing CO2 data for zone: {data.selectedZone})
              </span>
            )}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Year</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Load</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Solar PV</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Battery Charged</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Battery Discharged</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Grid Used</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Grid Exported</th>
                {data.selectedZone && (
                  <>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">CO2 Avoided</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">CO2 Emitted</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {yearlyData.slice(0, 10).map((row, index) => {
                let co2Avoided = 0, co2Emitted = 0
                if (data.selectedZone && data.carbonIntensityData.length > 0) {
                  const date = new Date(row.date)
                  const yearCarbonIntensity = data.carbonIntensityData
                    .filter(d => new Date(d.date).getFullYear() === date.getFullYear())
                    .reduce((acc, curr, _, arr) => acc + curr.carbonIntensity / arr.length, 0)
                  
                  co2Avoided = row.pv * yearCarbonIntensity / 1000
                  co2Emitted = row.gridUsed * yearCarbonIntensity / 1000
                }
                
                return (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">{new Date(row.date).getFullYear()}</td>
                    <td className="py-3 px-4">{row.load.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.pv.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.batteryCharged.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.batteryDischarged.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.gridUsed.toFixed(1)} kWh</td>
                    <td className="py-3 px-4">{row.gridExported.toFixed(1)} kWh</td>
                    {data.selectedZone && (
                      <>
                        <td className="py-3 px-4">{co2Avoided.toFixed(2)} kg</td>
                        <td className="py-3 px-4">{co2Emitted.toFixed(2)} kg</td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => exportToCSV('10years')}
            className="btn btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            📄 CSV
          </button>
          <button
            onClick={() => exportToPDF('10years')}
            className="btn btn-secondary"
          >
            <FileText className="w-4 h-4 mr-2" />
            📋 PDF
          </button>
        </div>
      </div>
    </div>
  )
}