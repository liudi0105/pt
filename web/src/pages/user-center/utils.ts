export function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

export function calcRatio(uploaded: number, downloaded: number) {
  if (downloaded === 0) return uploaded > 0 ? '\u221e' : '0.00'
  return (uploaded / downloaded).toFixed(3)
}
