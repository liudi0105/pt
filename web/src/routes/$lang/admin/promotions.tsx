import { createFileRoute } from '@tanstack/react-router'
import { PromotionManage } from '../../../pages/admin/PromotionManage'

export const Route = createFileRoute('/$lang/admin/promotions')({
  staticData: {
    title: 'admin:menu.promotions',
    menuCode: 'promotions',
    menuSort: 45,
  },
  component: PromotionManage,
})
