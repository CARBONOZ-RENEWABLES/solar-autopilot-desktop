import { useEffect, useRef, useState } from 'react'

export const useWebSocket = (url, onMessage) => {
  const ws = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const connect = () => {
      try {
        ws.current = new WebSocket(url)
        
        ws.current.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected(true)
          setError(null)
        }
        
        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (onMessage) {
              onMessage(data)
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err)
          }
        }
        
        ws.current.onclose = () => {
          console.log('WebSocket disconnected')
          setIsConnected(false)
          // Attempt to reconnect after 3 seconds
          setTimeout(connect, 3000)
        }
        
        ws.current.onerror = (err) => {
          console.error('WebSocket error:', err)
          setError(err)
        }
      } catch (err) {
        console.error('Error creating WebSocket:', err)
        setError(err)
        // Retry connection after 5 seconds
        setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url, onMessage])

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }

  return { isConnected, error, sendMessage }
}