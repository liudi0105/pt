import type { User, Snatch, SeedingInfo, Bookmark, Attendance } from '../types'
import { api } from './client'

export function getProfile() {
  return api.get<User>('/user/profile')
}

export function getSnatches(page = 1, pageSize = 20) {
  return api.get<{ snatches: Snatch[] }>('/user/snatches', {
    params: { page, page_size: pageSize },
  })
}

export function getSeeding(page = 1, pageSize = 20) {
  return api.get<{ seeding: SeedingInfo[] }>('/user/seeding', {
    params: { page, page_size: pageSize },
  })
}

export function updatePassword(currentPassword: string, newPassword: string) {
  return api.put('/user/password', {
    current_password: currentPassword,
    new_password: newPassword,
  })
}

export function getBookmarks(page = 1, pageSize = 20) {
  return api.get<{ bookmarks: Bookmark[] }>('/user/bookmarks', {
    params: { page, page_size: pageSize },
  })
}

export function buyUpload(bonusSpent: number) {
  return api.post('/user/buy-upload', { bonus_spent: bonusSpent })
}

export function buyDownload(bonusSpent: number) {
  return api.post('/user/buy-download', { bonus_spent: bonusSpent })
}

export function getBonusLogs(params: { page?: number; page_size?: number }) {
  return api.get<{ logs: import('../types').BonusLog[]; total: number }>('/user/bonus-logs', { params })
}

export function getSeedBonusRate() {
  return api.get<{
    bonus_per_hour: number
    seed_points: number
    torrent_count: number
    total_size: number
  }>('/user/seed-bonus-rate')
}

// Attendance
export function checkin() {
  return api.post('/user/checkin')
}

export function getCheckinStatus() {
  return api.get<Attendance>('/user/checkin')
}
