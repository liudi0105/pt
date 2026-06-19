import { createFileRoute } from '@tanstack/react-router'
import { Inbox } from '../../pages/Inbox'

export const Route = createFileRoute('/$lang/messages')({
  staticData: {
    title: '消息',
  },
  component: Inbox,
})
