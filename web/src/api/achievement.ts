import type { Achievement, UserAchievement } from '../types'
import { api } from './client'

export function listAchievements() {
  return api.get<{ achievements: Achievement[] }>('/achievements')
}

export function createAchievement(data: Partial<Achievement>) {
  return api.post<Achievement>('/admin/achievements', data)
}

export function updateAchievement(id: number, data: Partial<Achievement>) {
  return api.put<Achievement>(`/admin/achievements/${id}`, data)
}

export function deleteAchievement(id: number) {
  return api.delete(`/admin/achievements/${id}`)
}

export function listUserAchievements() {
  return api.get<{ achievements: UserAchievement[] }>('/user/achievements')
}

export function checkAchievements() {
  return api.post<{ unlocked: number[] }>('/user/achievements/check')
}

export function listUserAchievementsAdmin(userId: number) {
  return api.get<{ achievements: UserAchievement[] }>('/admin/user-achievements', { params: { user_id: userId } })
}
