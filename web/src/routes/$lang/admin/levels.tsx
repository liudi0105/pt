import { createFileRoute } from '@tanstack/react-router'
import { LevelManage } from '../../../pages/admin/LevelManage'
import { listLevels } from '../../../api/admin'

export const Route = createFileRoute('/$lang/admin/levels')({
  staticData: {
    title: 'admin:menu.levels',
    menuCode: 'levels',
    menuSort: 40,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['admin', 'levels'],
      queryFn: () => listLevels(),
    })
  },
  component: LevelManage,
})
