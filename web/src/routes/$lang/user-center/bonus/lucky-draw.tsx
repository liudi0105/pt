import { createFileRoute } from '@tanstack/react-router'
import { LuckyDraw } from '../../../../pages/LuckyDraw'
import { listLuckyDrawPrizes, listDrawRecords } from '../../../../api/luckydraw'
import { getProfile } from '../../../../api/user'

export const Route = createFileRoute('/$lang/user-center/bonus/lucky-draw')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['lucky-draw-prizes'],
        queryFn: () => listLuckyDrawPrizes(),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.ensureQueryData({
        queryKey: ['profile'],
        queryFn: () => getProfile(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['lucky-draw-records', 1],
        queryFn: () => listDrawRecords({ page: 1, page_size: 10 }),
      }),
    ])
  },
  component: LuckyDraw,
})
