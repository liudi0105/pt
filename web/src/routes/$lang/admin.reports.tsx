import { createFileRoute } from '@tanstack/react-router'
import { ReportManage } from '../../pages/admin/ReportManage'

export const Route = createFileRoute('/$lang/admin/reports')({
  staticData: {
    title: '举报管理',
  },
  component: ReportManage,
})
