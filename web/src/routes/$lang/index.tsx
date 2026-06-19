import { createFileRoute } from '@tanstack/react-router'
import { Home } from '../../pages/Home'

export const Route = createFileRoute('/$lang/')({
  staticData: {
    title: '首页',
  },
  component: Home,
})
