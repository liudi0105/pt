import { createFileRoute } from '@tanstack/react-router'
import { TorrentDetail } from '../../pages/TorrentDetail'

export const Route = createFileRoute('/$lang/torrents_/$id')({
  staticData: {
    title: '种子详情',
  },
  component: TorrentDetail,
})
