import { useEffect, useState } from 'react'
import { connectWebsocket } from '../services/websocket'
import { env } from '../config/env'

export const useRealtime = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = connectWebsocket(env.wsUrl)
    socket.addEventListener('open', () => setConnected(true))
    socket.addEventListener('close', () => setConnected(false))

    return () => socket.close()
  }, [])

  return connected
}
