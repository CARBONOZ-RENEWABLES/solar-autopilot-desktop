import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Bot, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Bell, 
  TrendingUp, 
  PieChart,
  X,
  Sun,
  Moon
} from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Energy Dashboard', href: '/energy-dashboard', icon: Home },
  { name: 'AI Dashboard', href: '/ai-dashboard', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Chart', href: '/chart', icon: TrendingUp },
  { name: 'Results', href: '/results', icon: PieChart },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose, isDark, onToggleTheme }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
                <img src="https://carbonoz.com/assets/images/image04.jpg?v=8b5d1d9b" alt="CARBONOZ Logo" className="w-12 h-12 object-cover rounded-xl" />
              </div>
              <div>
                <a href="https://carbonoz.com/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-900 dark:text-white">
                  CARBONOZ
                </a>
                <p className="text-sm text-primary font-medium">SolarAutopilot</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Dark Mode
              </span>
              <button
                onClick={onToggleTheme}
                className={clsx(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                  isDark ? 'bg-primary' : 'bg-gray-200'
                )}
              >
                <span
                  className={clsx(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
                <Sun className={clsx(
                  'absolute left-1 w-3 h-3 text-yellow-500 transition-opacity',
                  isDark ? 'opacity-0' : 'opacity-100'
                )} />
                <Moon className={clsx(
                  'absolute right-1 w-3 h-3 text-blue-400 transition-opacity',
                  isDark ? 'opacity-100' : 'opacity-0'
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}