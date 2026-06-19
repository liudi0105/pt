import { api } from './client'
import type { DictData } from '../types'

export function getDictData(typeKeys: string[]) {
  const params = new URLSearchParams()
  typeKeys.forEach((key) => params.append('type_key', key))
  return api.get<{ data: Record<string, DictData[]> }>('/dict-data', { params })
}
