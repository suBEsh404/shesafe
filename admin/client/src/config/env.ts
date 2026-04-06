export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000',
  wsUrl: import.meta.env.VITE_WS_URL ?? 'wss://ws.local',
}
