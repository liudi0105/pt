export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

export function formatDuration(hours: number): string {
  if (hours < 1) return '< 1h'
  const days = Math.floor(hours / 24)
  const h = hours % 24
  if (days === 0) return `${h}h`
  if (h === 0) return `${days}d`
  return `${days}d ${h}h`
}

export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec === 0) return '0 B/s'
  const units = ['B/s', 'KiB/s', 'MiB/s', 'GiB/s']
  const i = Math.floor(Math.log(bytesPerSec) / Math.log(1024))
  return `${(bytesPerSec / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

export function formatRatio(uploaded: number, downloaded: number): string {
  if (downloaded === 0) return uploaded > 0 ? '∞' : '0.00'
  return (uploaded / downloaded).toFixed(2)
}
