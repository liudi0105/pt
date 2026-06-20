import { api } from './client'

export interface GameBet {
  id: number
  user_id: number
  bet_amount: number
  bet_choice: string
  dice_result: number
  result: string
  payout: number
  created_at: string
}

export function placeBet(data: { bet_amount: number; bet_choice: string }) {
  return api.post<{
    ok: boolean
    dice: number[]
    total: number
    result: string
    payout: number
    bet_amount: number
    remaining: number
  }>('/games/bet', data)
}

export function listBets(params: { page?: number; page_size?: number }) {
  return api.get<{ bets: GameBet[]; total: number }>('/user/bets', { params })
}
