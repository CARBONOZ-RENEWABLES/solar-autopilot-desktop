import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Initialize theme on client side
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark)
    setIsDark(shouldBeDark)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    const body = document.body
    
    if (isDark) {
      root.classList.add('dark')
      body.style.backgroundColor = 'rgba(24, 27, 31, 1)'
    } else {
      root.classList.remove('dark')
      body.style.backgroundColor = ''
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)

  return { isDark, toggleTheme }
}