import type { Invite } from '../types'
import { api } from './client'

export function listInvites() {
  return api.get<{ invites: Invite[] }>('/invites')
}

export function createInvite() {
  return api.post<Invite>('/invites')
}

export function registerWithInvite(username: string, password: string, email: string, invite: string) {
  return api.post('/auth/register-with-invite', { username, password, email, invite })
}
