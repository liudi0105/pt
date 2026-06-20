import { createFileRoute } from '@tanstack/react-router'
import Settings from '../../../pages/user-center/Settings'

export const Route = createFileRoute('/$lang/user-center/settings')({
  staticData: {
    title: 'user:menu.settings',
    menuCode: 'user-settings',
    menuSort: 110,
  },
  component: Settings,
})
