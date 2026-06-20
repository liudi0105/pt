import { createFileRoute } from '@tanstack/react-router'
import { TorrentDetail } from '../../../pages/TorrentDetail'

export const Route = createFileRoute('/$lang/torrents/$id')({
  staticData: {
    title: 'common:nav.torrentDetail',
    menuCode: 'torrents',
  },
  component: TorrentDetail,
})
