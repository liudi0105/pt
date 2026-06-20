import { createFileRoute } from '@tanstack/react-router'
import { BonusManage } from '../../../pages/admin/BonusManage'

export const Route = createFileRoute('/$lang/admin/bonus')({
  staticData: {
    title: 'admin:menu.bonus',
    menuCode: 'bonus',
    menuSort: 75,
  },
  component: BonusManage,
})
