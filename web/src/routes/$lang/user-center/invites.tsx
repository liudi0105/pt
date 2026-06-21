import { createFileRoute } from '@tanstack/react-router'
import { Invites } from '../../../pages/Invites'
import { listInvites } from '../../../api/invite'

export const Route = createFileRoute('/$lang/user-center/invites')({
  staticData: {
    title: 'user:menu.invites',
    menuCode: 'user-invites',
    menuSort: 80,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['invites'],
      queryFn: () => listInvites(),
    })
  },
  component: Invites,
})
