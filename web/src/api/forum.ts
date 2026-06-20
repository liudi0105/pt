import { api } from './client'

export interface Forum {
  id: number
  name: string
  description: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Topic {
  id: number
  forum_id: number
  user_id: number
  title: string
  views: number
  post_count: number
  is_sticky: boolean
  is_locked: boolean
  last_post_at: string
  created_at: string
  username?: string
  forum_name?: string
}

export interface Post {
  id: number
  topic_id: number
  user_id: number
  content: string
  is_first: boolean
  created_at: string
  username?: string
}

export function listForums() {
  return api.get<{ forums: Forum[] }>('/forums')
}

export function listForumTopics(forumId: number, params: { page?: number; page_size?: number } = {}) {
  return api.get<{ topics: Topic[]; total: number; forum: Forum }>(`/forums/${forumId}/topics`, { params })
}

export function getTopic(id: number) {
  return api.get<{ topic: Topic }>(`/forums/topics/${id}`)
}

export function listTopicPosts(topicId: number, params: { page?: number; page_size?: number } = {}) {
  return api.get<{ posts: Post[]; total: number; topic: Topic }>(`/forums/topics/${topicId}/posts`, { params })
}

export function createTopic(data: { forum_id: number; title: string; content: string }) {
  return api.post<{ topic: Topic; post: Post }>('/forums/topics', data)
}

export function createPost(topicId: number, data: { content: string }) {
  return api.post<{ post: Post }>(`/forums/topics/${topicId}/posts`, data)
}

export function updateTopic(id: number, data: { title?: string; content?: string }) {
  return api.put<{ topic: Topic }>(`/forums/topics/${id}`, data)
}

export function updatePost(id: number, data: { content: string }) {
  return api.put<{ post: Post }>(`/forums/posts/${id}`, data)
}

export function deleteTopic(id: number) {
  return api.delete(`/forums/topics/${id}`)
}

export function deletePost(id: number) {
  return api.delete(`/forums/posts/${id}`)
}

export function listRecentTopics(params: { page?: number; page_size?: number } = {}) {
  return api.get<{ topics: Topic[]; total: number }>('/forums/recent', { params })
}

export function searchTopics(params: { q: string; page?: number; page_size?: number }) {
  return api.get<{ topics: Topic[]; total: number; query: string }>('/forums/search', { params })
}

export function listUnreadTopics(params: { page?: number; page_size?: number } = {}) {
  return api.get<{ topics: Topic[]; total: number }>('/forums/unread', { params })
}

// Admin
export function adminListForums() {
  return api.get<{ forums: Forum[] }>('/admin/forums')
}

export function adminCreateForum(data: { name: string; description?: string; sort_order?: number }) {
  return api.post<Forum>('/admin/forums', data)
}

export function adminUpdateForum(id: number, data: { name: string; description?: string; sort_order?: number }) {
  return api.put<Forum>(`/admin/forums/${id}`, data)
}

export function adminDeleteForum(id: number) {
  return api.delete(`/admin/forums/${id}`)
}
