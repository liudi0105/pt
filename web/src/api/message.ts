import type { Message } from '../types'
import { api } from './client'

export function listInbox(page = 1) {
  return api.get<{ messages: Message[]; unread: number }>('/messages/inbox', {
    params: { page, page_size: 20 },
  })
}

export function listOutbox(page = 1) {
  return api.get<{ messages: Message[] }>('/messages/outbox', {
    params: { page, page_size: 20 },
  })
}

export function sendMessage(receiverId: number, subject: string, body: string) {
  return api.post('/messages', { receiver_id: receiverId, subject, body })
}

export function readMessage(id: number) {
  return api.get<Message>(`/messages/${id}`)
}

export function deleteMessage(id: number) {
  return api.delete(`/messages/${id}`)
}
