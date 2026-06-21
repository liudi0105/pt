import { createFileRoute } from '@tanstack/react-router'
import Bonus from '../../../../pages/user-center/Bonus'
import { getProfile, getSeedBonusRate } from '../../../../api/user'

export const Route = createFileRoute('/$lang/user-center/bonus/')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['profile'],
        queryFn: () => getProfile(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['seed-bonus-rate'],
        queryFn: () => getSeedBonusRate(),
      }),
    ])
  },
  component: Bonus,
})
