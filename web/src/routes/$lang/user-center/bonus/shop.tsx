import { createFileRoute } from '@tanstack/react-router'
import { Shop } from '../../../../pages/Shop'
import { listShopItems } from '../../../../api/shop'

export const Route = createFileRoute('/$lang/user-center/bonus/shop')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['shop-items'],
      queryFn: () => listShopItems(),
    })
  },
  component: Shop,
})
