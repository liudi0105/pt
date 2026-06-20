import { createFileRoute } from '@tanstack/react-router'
import { TorrentsPage } from '../../../pages/TorrentsPage'

export interface TorrentSearchParams {
  keyword?: string
  categories?: string
  incldead?: number
  spstate?: number
  sort?: string
  order?: string
  page?: number
  page_size?: number
  sources?: string
  codecs?: string
  standards?: string
  media?: string
  processings?: string
  teams?: string
  audiocodecs?: string
}

export const Route = createFileRoute('/$lang/torrents/')({
  validateSearch: (search: Record<string, string>): TorrentSearchParams => ({
    keyword: search.keyword || undefined,
    categories: search.categories || undefined,
    incldead: search.incldead ? Number(search.incldead) : undefined,
    spstate: search.spstate ? Number(search.spstate) : undefined,
    sort: search.sort || undefined,
    order: search.order || undefined,
    page: search.page ? Number(search.page) : undefined,
    page_size: search.page_size ? Number(search.page_size) : undefined,
    sources: search.sources || undefined,
    codecs: search.codecs || undefined,
    standards: search.standards || undefined,
    media: search.media || undefined,
    processings: search.processings || undefined,
    teams: search.teams || undefined,
    audiocodecs: search.audiocodecs || undefined,
  }),
  component: TorrentsPage,
})
