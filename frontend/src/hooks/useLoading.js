import { useState, useEffect } from 'react'

export function usePageLoading(initialDelay = 1000, minLoadingTime = 2000) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    
    // Simulate progressive loading
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return 95
        return prev + Math.random() * 10
      })
    }, 100)

    // Minimum loading time
    const loadingTimer = setTimeout(() => {
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadingTime - elapsed)
      
      setTimeout(() => {
        setLoadingProgress(100)
        setTimeout(() => setIsLoading(false), 300)
      }, remainingTime)
    }, initialDelay)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(loadingTimer)
    }
  }, [initialDelay, minLoadingTime])

  return { isLoading, loadingProgress }
}

export function useApiLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const executeWithLoading = async (asyncFunction) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await asyncFunction()
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, executeWithLoading }
}