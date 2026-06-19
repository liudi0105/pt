import { createFileRoute } from '@tanstack/react-router'
import { TorrentsPage } from '../../pages/TorrentsPage'

export const Route = createFileRoute('/$lang/torrents')({
  staticData: {
    title: 'common:nav.torrents',
    menuCode: 'torrents',
  },
  component: TorrentsPage,
})
