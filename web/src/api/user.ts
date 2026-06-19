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

// Attendance
export function checkin() {
  return api.post('/user/checkin')
}

export function getCheckinStatus() {
  return api.get<Attendance>('/user/checkin')
}
