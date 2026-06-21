import { createFileRoute } from '@tanstack/react-router'
import Checkin from '../../../pages/user-center/Checkin'
import { getCheckinStatus } from '../../../api/user'

export const Route = createFileRoute('/$lang/user-center/checkin')({
  staticData: {
    title: 'user:menu.checkin',
    menuCode: 'user-checkin',
    menuSort: 20,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['checkin'],
      queryFn: () => getCheckinStatus(),
    })
  },
  component: Checkin,
})
