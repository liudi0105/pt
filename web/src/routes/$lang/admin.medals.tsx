import { createFileRoute } from '@tanstack/react-router'
import { MedalManage } from '../../pages/admin/MedalManage'

export const Route = createFileRoute('/$lang/admin/medals')({
  staticData: {
    title: 'admin:menu.medals',
    menuCode: 'medals',
  },
  component: MedalManage,
})
