import { createFileRoute } from '@tanstack/react-router'
import { Shop } from '../../../../pages/Shop'

export const Route = createFileRoute('/$lang/user-center/bonus/shop')({
  staticData: {
    title: 'common:nav.shop',
    menuCode: 'shop',
    menuSort: 10,
  },
  component: Shop,
})
