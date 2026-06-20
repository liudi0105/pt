import { api } from './client'

export interface LuckyDrawPrize {
  id: number
  name: string
  description: string
  price: number
  probability: number
  stock: number
  image: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface LuckyDrawRecord {
  id: number
  user_id: number
  prize_id: number | null
  prize_name: string
  cost: number
  created_at: string
}

export function listLuckyDrawPrizes() {
  return api.get<{ prizes: LuckyDrawPrize[] }>('/lucky-draw/prizes')
}

export function draw() {
  return api.post<{ ok: boolean; prize: string; won: boolean; cost: number; remaining: number }>('/lucky-draw/draw')
}

export function listDrawRecords(params: { page?: number; page_size?: number }) {
  return api.get<{ records: LuckyDrawRecord[]; total: number }>('/user/lucky-draw-records', { params })
}
