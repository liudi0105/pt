import { createFileRoute } from '@tanstack/react-router'
import Snatches from '../../../pages/user-center/Snatches'
import { getSnatches } from '../../../api/user'

export const Route = createFileRoute('/$lang/user-center/snatches')({
  staticData: {
    title: 'user:menu.snatches',
    menuCode: 'user-snatches',
    menuSort: 120,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['snatches'],
      queryFn: () => getSnatches(),
    })
  },
  component: Snatches,
})
