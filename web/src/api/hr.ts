import type { HRItem } from '../types'
import { api } from './client'

export function listHR(page = 1) {
  return api.get<{ hr_list: HRItem[]; total: number }>('/user/hr', {
    params: { page, page_size: 20 },
  })
}
