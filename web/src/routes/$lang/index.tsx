import { createFileRoute } from '@tanstack/react-router'
import { Home } from '../../pages/Home'

export const Route = createFileRoute('/$lang/')({
  staticData: {
    title: 'common:nav.home',
  },
  component: Home,
})
