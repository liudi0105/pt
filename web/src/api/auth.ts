import type { LoginResponse } from '../types'
import { api } from './client'

export function login(username: string, password: string) {
  return api.post<LoginResponse>('/auth/login', { username, password })
}

export function register(username: string, email: string, password: string) {
  return api.post('/auth/register', { username, email, password })
}
