import { createFileRoute } from '@tanstack/react-router'
import { UserCenter } from '../../pages/UserCenter'

export const Route = createFileRoute('/$lang/user_')({
  staticData: {
    title: '用户中心',
  },
  component: UserCenter,
})
