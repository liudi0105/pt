import { createFileRoute } from '@tanstack/react-router'
import BonusLogs from '../../../../pages/user-center/BonusLogs'
import { getBonusLogs } from '../../../../api/user'

export const Route = createFileRoute('/$lang/user-center/bonus/logs')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['user-bonus-logs', { page: 1 }],
      queryFn: () => getBonusLogs({ page: 1, page_size: 20 }),
    })
  },
  component: BonusLogs,
})
