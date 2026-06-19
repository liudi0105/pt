import type { News } from '../types'
import { api } from './client'

export function listNews() {
  return api.get<{ news: News[] }>('/news')
}
