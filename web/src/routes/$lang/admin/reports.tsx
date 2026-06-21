import { createFileRoute } from '@tanstack/react-router'
import { ReportManage } from '../../../pages/admin/ReportManage'
import { listReports } from '../../../api/report'

export const Route = createFileRoute('/$lang/admin/reports')({
  staticData: {
    title: 'admin:menu.reports',
    menuCode: 'reports',
    menuSort: 50,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['admin-reports'],
      queryFn: () => listReports(),
    })
  },
  component: ReportManage,
})
