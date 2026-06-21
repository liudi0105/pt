import { api } from './client'

export function getBonusSettings() {
  return api.get<{
    tzero: number
    nzero: number
    bzero: number
    l: number
    perseeding: number
    maxseeding: number
    harvest_interval: string
  }>('/user/bonus-settings')
}

export function getSeedBonusBreakdown() {
  return api.get<{
    torrents: Array<{
      torrent_id: number
      name: string
      size: number
      seeders: number
      weeks_alive: number
      a_value: number
    }>
    total_a: number
    seed_bonus: number
    max_bonus: number
    percent: number
    count: number
    total_size: number
    seed_points: number
  }>('/user/seed-bonus-breakdown')
}
