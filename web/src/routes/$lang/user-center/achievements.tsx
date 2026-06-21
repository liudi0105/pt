import { createFileRoute } from '@tanstack/react-router'
import { Achievements } from '../../../pages/Achievements'
import { listAchievements, listUserAchievements } from '../../../api/achievement'

export const Route = createFileRoute('/$lang/user-center/achievements')({
  staticData: {
    title: 'user:menu.achievements',
    menuCode: 'user-achievements',
    menuSort: 85,
  },
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['achievements'],
        queryFn: () => listAchievements(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['user-achievements'],
        queryFn: () => listUserAchievements(),
      }),
    ])
  },
  component: Achievements,
})
