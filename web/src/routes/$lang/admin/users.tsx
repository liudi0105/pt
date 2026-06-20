import { createFileRoute } from '@tanstack/react-router'
import { UserManage } from '../../../pages/admin/UserManage'

export const Route = createFileRoute('/$lang/admin/users')({
  staticData: {
    title: 'admin:menu.users',
    menuCode: 'users',
    menuSort: 20,
  },
  component: UserManage,
})
