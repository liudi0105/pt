import { createFileRoute } from '@tanstack/react-router'
import { LevelManage } from '../../../pages/admin/LevelManage'

export const Route = createFileRoute('/$lang/admin/levels')({
  staticData: {
    title: 'admin:menu.levels',
    menuCode: 'levels',
    menuSort: 40,
  },
  component: LevelManage,
})
