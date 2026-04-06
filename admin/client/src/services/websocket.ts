export const connectWebsocket = (url: string) => {
  const socket = new WebSocket(url)
  return socket
}
