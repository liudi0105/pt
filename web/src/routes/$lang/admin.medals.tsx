import { createFileRoute } from '@tanstack/react-router'
import { MedalManage } from '../../pages/admin/MedalManage'

export const Route = createFileRoute('/$lang/admin/medals')({
  staticData: {
    title: '勋章管理',
  },
  component: MedalManage,
})
