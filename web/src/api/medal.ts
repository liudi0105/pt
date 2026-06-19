import type { Medal, UserMedal } from '../types'
import { api } from './client'

export function listMedals() {
  return api.get<{ medals: Medal[] }>('/medals')
}

export function createMedal(data: Partial<Medal>) {
  return api.post<Medal>('/admin/medals', data)
}

export function deleteMedal(id: number) {
  return api.delete(`/admin/medals/${id}`)
}

export function buyMedal(id: number) {
  return api.post(`/medals/${id}/buy`)
}

export function listUserMedals() {
  return api.get<{ medals: UserMedal[] }>('/user/medals')
}
