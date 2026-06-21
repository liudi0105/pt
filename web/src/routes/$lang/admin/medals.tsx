import { createFileRoute } from '@tanstack/react-router'
import { MedalManage } from '../../../pages/admin/MedalManage'
import { listMedals } from '../../../api/medal'

export const Route = createFileRoute('/$lang/admin/medals')({
  staticData: {
    title: 'admin:menu.medals',
    menuCode: 'medals',
    menuSort: 55,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['admin-medals'],
      queryFn: () => listMedals(),
    })
  },
  component: MedalManage,
})
