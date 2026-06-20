import { createFileRoute } from '@tanstack/react-router'
import { Inbox } from '../../../pages/Inbox'

export const Route = createFileRoute('/$lang/user-center/messages')({
  staticData: {
    title: 'user:menu.messages',
    menuCode: 'user-messages',
    menuSort: 70,
  },
  component: Inbox,
})
