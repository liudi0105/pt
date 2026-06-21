import { createFileRoute } from '@tanstack/react-router'
import Profile from '../../../pages/user-center/Profile'
import { getProfile } from '../../../api/user'

export const Route = createFileRoute('/$lang/user-center/')({
  staticData: {
    title: 'user:menu.profile',
    menuCode: 'user-profile',
    menuSort: 10,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['profile'],
      queryFn: () => getProfile(),
    })
  },
  component: Profile,
})
