import { api } from './client'
import type { DictType, DictData, UserLevel, RoleModel, Permission, SiteSetting, Torrent, User, Announcement, BonusLog } from '../types'

// ---- Dict Types ----
export function listDictTypes() {
  return api.get<{ types: DictType[] }>('/admin/dict-types')
}
export function createDictType(data: Partial<DictType>) {
  return api.post<DictType>('/admin/dict-types', data)
}
export function updateDictType(id: number, data: Partial<DictType>) {
  return api.put<DictType>(`/admin/dict-types/${id}`, data)
}
export function deleteDictType(id: number) {
  return api.delete(`/admin/dict-types/${id}`)
}

// ---- Dict Data ----
export function listDictData(typeId?: number, typeName?: string) {
  return api.get<{ data: DictData[] }>('/admin/dict-data', {
    params: { type_id: typeId, type_name: typeName },
  })
}
export function createDictData(data: Partial<DictData>) {
  return api.post<DictData>('/admin/dict-data', data)
}
export function updateDictData(id: number, data: Partial<DictData>) {
  return api.put<DictData>(`/admin/dict-data/${id}`, data)
}
export function deleteDictData(id: number) {
  return api.delete(`/admin/dict-data/${id}`)
}

// ---- Users ----
export function adminListUsers(params: {
  role?: string
  status?: number
  keyword?: string
  page?: number
  page_size?: number
}) {
  return api.get<{ users: any[]; total: number }>('/admin/users', { params })
}
export function adminUpdateUserRole(id: number, role: string) {
  return api.put(`/admin/users/${id}/role`, { role })
}
export function adminUpdateUserStatus(id: number, status: number) {
  return api.put(`/admin/users/${id}/status`, { status })
}
export function adminUpdateUserTraffic(
  id: number,
  data: { uploaded?: number; downloaded?: number; bonus?: number },
) {
  return api.put(`/admin/users/${id}/traffic`, data)
}
export function adminResetPasskey(id: number) {
  return api.post<{ passkey: string }>(`/admin/users/${id}/reset-passkey`)
}

// ---- Levels ----
export function listLevels() {
  return api.get<{ levels: UserLevel[] }>('/admin/levels')
}
export function createLevel(data: Partial<UserLevel>) {
  return api.post<UserLevel>('/admin/levels', data)
}
export function updateLevel(id: number, data: Partial<UserLevel>) {
  return api.put<UserLevel>(`/admin/levels/${id}`, data)
}
export function deleteLevel(id: number) {
  return api.delete(`/admin/levels/${id}`)
}

// ---- Promotions ----
export function adminUpdatePromotion(torrentId: number, promotion: string) {
  return api.put(`/admin/torrents/${torrentId}/promotion`, { promotion })
}

export function adminBatchUpdatePromotion(params: { category?: string; keyword?: string; promotion: string }) {
  return api.post<{ affected: number }>('/admin/torrents/promotion/batch', params)
}

// ---- Roles ----
export function listRoles() {
  return api.get<{ roles: RoleModel[] }>('/admin/roles')
}

export function getRole(id: number) {
  return api.get<RoleModel>(`/admin/roles/${id}`)
}

export function createRole(data: Partial<RoleModel>) {
  return api.post<RoleModel>('/admin/roles', data)
}

export function updateRole(id: number, data: Partial<RoleModel>) {
  return api.put<RoleModel>(`/admin/roles/${id}`, data)
}

export function deleteRole(id: number) {
  return api.delete(`/admin/roles/${id}`)
}

export function setRolePermissions(id: number, permissionIDs: number[]) {
  return api.put(`/admin/roles/${id}/permissions`, { permission_ids: permissionIDs })
}

// ---- Permissions ----
export function listPermissions() {
  return api.get<{ permissions: Permission[] }>('/admin/permissions')
}

// ---- Site Settings ----
export function listSiteSettings() {
  return api.get<{ settings: SiteSetting[] }>('/admin/settings')
}

export function updateSiteSetting(key: string, value: string) {
  return api.put(`/admin/settings/${key}`, { value })
}

// ---- Dashboard ----
export interface AdminDashboardStats {
  total_users: number
  active_users: number
  total_upload_bytes: number
  total_download_bytes: number
  latest_users: User[]
  latest_torrents: Torrent[]
}

// ---- Announcements ----
export function listAnnouncements() {
  return api.get<{ announcements: Announcement[] }>('/admin/announcements')
}
export function createAnnouncement(data: Partial<Announcement>) {
  return api.post<Announcement>('/admin/announcements', data)
}
export function updateAnnouncement(id: number, data: Partial<Announcement>) {
  return api.put<Announcement>(`/admin/announcements/${id}`, data)
}
export function deleteAnnouncement(id: number) {
  return api.delete(`/admin/announcements/${id}`)
}

export function adminGetDashboard() {
  return api.get<AdminDashboardStats>('/admin/dashboard')
}

// ---- Bonus Logs ----
export function listBonusLogs(params: {
  user_id?: number
  business_type?: number
  page?: number
  page_size?: number
}) {
  return api.get<{ logs: BonusLog[]; total: number }>('/admin/bonus-logs', { params })
}

// ---- Admin Docs Views ----
export function adminGetClientRisk() {
  return api.get('/admin/client-risk')
}

export function adminGetResources() {
  return api.get('/admin/resources')
}
