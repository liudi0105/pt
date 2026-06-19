import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard } from '../../pages/admin/Dashboard'

export const Route = createFileRoute('/$lang/admin/')({
  staticData: {
    title: '管理后台',
  },
  component: AdminDashboard,
})
