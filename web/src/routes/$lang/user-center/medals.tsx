import { createFileRoute } from '@tanstack/react-router'
import { Medals } from '../../../pages/Medals'
import { listMedals, listUserMedals } from '../../../api/medal'

export const Route = createFileRoute('/$lang/user-center/medals')({
  staticData: {
    title: 'user:menu.medals',
    menuCode: 'user-medals',
    menuSort: 90,
  },
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['medals'],
        queryFn: () => listMedals(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['user-medals'],
        queryFn: () => listUserMedals(),
      }),
    ])
  },
  component: Medals,
})
