import { createFileRoute } from '@tanstack/react-router'
import { Medals } from '../../pages/Medals'

export const Route = createFileRoute('/$lang/medals')({
  staticData: {
    title: 'common:nav.medals',
  },
  component: Medals,
})
