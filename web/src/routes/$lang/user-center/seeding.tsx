import { createFileRoute } from '@tanstack/react-router'
import Seeding from '../../../pages/user-center/Seeding'
import { getSeeding } from '../../../api/user'

export const Route = createFileRoute('/$lang/user-center/seeding')({
  staticData: {
    title: 'user:menu.seeding',
    menuCode: 'user-seeding',
    menuSort: 30,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['seeding'],
      queryFn: () => getSeeding(),
    })
  },
  component: Seeding,
})
