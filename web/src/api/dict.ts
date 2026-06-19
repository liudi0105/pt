import { api } from './client'
import type { DictData } from '../types'

export function getDictData(typeNames: string[]) {
  const params = new URLSearchParams()
  typeNames.forEach(n => params.append('type_name', n))
  return api.get<{ data: Record<string, DictData[]> }>('/dict-data', { params })
}
