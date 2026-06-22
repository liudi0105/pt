import type { Subtitle } from '../types'
import { api } from './client'

export interface SubtitleListParams {
  page?: number
  page_size?: number
  keyword?: string
  language?: string
}

export interface SubtitleListResult {
  subtitles: Subtitle[]
  total: number
}

export function listSubtitles(params: SubtitleListParams = {}) {
  return api.get<SubtitleListResult>('/subtitles', { params })
}
