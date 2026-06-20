import { api } from './client'

export interface ShopItem {
  id: number
  name: string
  description: string
  price: number
  stock: number
  type: string
  metadata: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface UserItem {
  id: number
  user_id: number
  item_id: number
  quantity: number
  created_at: string
}

export function listShopItems() {
  return api.get<{ items: ShopItem[] }>('/shop/items')
}

export function buyShopItem(id: number) {
  return api.post<{ ok: boolean; name: string }>(`/shop/items/${id}/buy`)
}

export function listMyItems() {
  return api.get<{ items: UserItem[] }>('/user/items')
}
