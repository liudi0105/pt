import type { Report } from '../types'
import { api } from './client'

export function createReport(targetType: string, targetId: number, reason: string) {
  return api.post('/reports', { target_type: targetType, target_id: targetId, reason })
}

export function listReports(page = 1) {
  return api.get<{ reports: Report[]; total: number }>('/admin/reports', {
    params: { page, page_size: 20 },
  })
}

export function resolveReport(id: number) {
  return api.post(`/admin/reports/${id}/resolve`)
}
