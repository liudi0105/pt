import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard } from '../../../pages/admin/Dashboard'
import { adminGetDashboard } from '../../../api/admin'

export const Route = createFileRoute('/$lang/admin/')({
  staticData: {
    title: 'admin:menu.dashboard',
    menuCode: 'dashboard',
    menuSort: 10,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['admin', 'dashboard'],
      queryFn: () => adminGetDashboard(),
    })
  },
  component: AdminDashboard,
})
