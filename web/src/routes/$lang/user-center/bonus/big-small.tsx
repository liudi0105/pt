import { createFileRoute } from '@tanstack/react-router'
import { BigSmall } from '../../../../pages/BigSmall'
import { getProfile } from '../../../../api/user'

export const Route = createFileRoute('/$lang/user-center/bonus/big-small')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['profile'],
      queryFn: () => getProfile().then(r => r.data),
    })
  },
  component: BigSmall,
})
