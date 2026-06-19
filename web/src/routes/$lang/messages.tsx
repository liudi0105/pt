import { createFileRoute } from '@tanstack/react-router'
import { Inbox } from '../../pages/Inbox'

export const Route = createFileRoute('/$lang/messages')({
  staticData: {
    title: 'common:nav.inbox',
  },
  component: Inbox,
})
