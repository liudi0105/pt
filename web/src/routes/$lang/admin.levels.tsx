import { createFileRoute } from '@tanstack/react-router'
import { LevelManage } from '../../pages/admin/LevelManage'

export const Route = createFileRoute('/$lang/admin/levels')({
  staticData: {
    title: '等级管理',
  },
  component: LevelManage,
})
