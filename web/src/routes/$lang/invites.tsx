import { createFileRoute } from '@tanstack/react-router'
import { Invites } from '../../pages/Invites'

export const Route = createFileRoute('/$lang/invites')({
  staticData: {
    title: '邀请',
  },
  component: Invites,
})
