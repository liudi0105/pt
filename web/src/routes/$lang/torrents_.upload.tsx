import { createFileRoute } from '@tanstack/react-router'
import { Publish } from '../../pages/Publish'

export const Route = createFileRoute('/$lang/torrents_/upload')({
  staticData: {
    title: 'common:nav.upload',
    menuCode: 'upload',
  },
  component: Publish,
})
