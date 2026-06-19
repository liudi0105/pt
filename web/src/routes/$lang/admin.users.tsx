import { createFileRoute } from '@tanstack/react-router'
import { UserManage } from '../../pages/admin/UserManage'

export const Route = createFileRoute('/$lang/admin/users')({
  staticData: {
    title: '用户管理',
  },
  component: UserManage,
})
