import type { Offer, OfferVote } from '../types'
import { api } from './client'

export interface OfferListParams {
  page?: number
  page_size?: number
  category?: string
  keyword?: string
  status?: string
}

export function listOffers(params: OfferListParams = {}) {
  return api.get<{ offers: Offer[]; total: number }>('/offers', { params })
}

export function getOffer(id: number) {
  return api.get<Offer>(`/offers/${id}`)
}

export function createOffer(data: { name: string; description?: string; category?: string }) {
  return api.post<Offer>('/offers', data)
}

export function deleteOffer(id: number) {
  return api.delete(`/offers/${id}`)
}

export function voteOffer(id: number, isYeah: boolean) {
  return api.post(`/offers/${id}/vote`, { is_yeah: isYeah })
}

export function getOfferVotes(id: number) {
  return api.get<{ votes: OfferVote[] }>(`/offers/${id}/votes`)
}
