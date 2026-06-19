import { api } from './client'
import type { Announcement } from '../types'

export function listActiveAnnouncements() {
  return api.get<{ announcements: Announcement[] }>('/announcements')
}
