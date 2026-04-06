export const shortenHash = (hash: string, start = 6, end = 4) => {
  if (hash.length <= start + end) return hash
  return `${hash.slice(0, start)}...${hash.slice(-end)}`
}
