import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard } from '../../../pages/admin/Dashboard'

export const Route = createFileRoute('/$lang/admin/')({
  staticData: {
    title: 'admin:menu.dashboard',
    menuCode: 'dashboard',
    menuSort: 10,
  },
  component: AdminDashboard,
})
