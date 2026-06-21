import { createFileRoute } from '@tanstack/react-router'
import { BonusManage } from '../../../pages/admin/BonusManage'
import { listBonusLogs } from '../../../api/admin'

export const Route = createFileRoute('/$lang/admin/bonus')({
  staticData: {
    title: 'admin:menu.bonus',
    menuCode: 'bonus',
    menuSort: 75,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['admin-bonus-logs', { page: 1, userId: '', businessType: '' }],
      queryFn: () => listBonusLogs({ page: 1, page_size: 20 }),
    })
  },
  component: BonusManage,
})
