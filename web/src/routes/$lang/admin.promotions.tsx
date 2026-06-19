import { createFileRoute } from '@tanstack/react-router'
import { PromotionManage } from '../../pages/admin/PromotionManage'

export const Route = createFileRoute('/$lang/admin/promotions')({
  component: PromotionManage,
})
