import { createFileRoute } from '@tanstack/react-router'
import { Inbox } from '../../../pages/Inbox'
import { listInbox } from '../../../api/message'

export const Route = createFileRoute('/$lang/user-center/messages')({
  staticData: {
    title: 'user:menu.messages',
    menuCode: 'user-messages',
    menuSort: 70,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['messages', 'inbox', 1],
      queryFn: () => listInbox(1),
    })
  },
  component: Inbox,
})
