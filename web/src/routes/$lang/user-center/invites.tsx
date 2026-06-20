import { createFileRoute } from '@tanstack/react-router'
import { Invites } from '../../../pages/Invites'

export const Route = createFileRoute('/$lang/user-center/invites')({
  staticData: {
    title: 'user:menu.invites',
    menuCode: 'user-invites',
    menuSort: 80,
  },
  component: Invites,
})
