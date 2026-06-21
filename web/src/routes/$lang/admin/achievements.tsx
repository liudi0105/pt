import { createFileRoute } from '@tanstack/react-router'
import { AchievementManage } from '../../../pages/admin/AchievementManage'
import { listAchievements } from '../../../api/achievement'

export const Route = createFileRoute('/$lang/admin/achievements')({
  staticData: {
    title: 'admin:menu.achievements',
    menuCode: 'achievements',
    menuSort: 56,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['admin-achievements'],
      queryFn: () => listAchievements(),
    })
  },
  component: AchievementManage,
})
