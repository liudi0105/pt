import { createFileRoute } from '@tanstack/react-router'
import { ReportManage } from '../../../pages/admin/ReportManage'

export const Route = createFileRoute('/$lang/admin/reports')({
  staticData: {
    title: 'admin:menu.reports',
    menuCode: 'reports',
    menuSort: 50,
  },
  component: ReportManage,
})
