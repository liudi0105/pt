import { createFileRoute } from '@tanstack/react-router'
import { RoleManage } from '../../pages/admin/RoleManage'

export const Route = createFileRoute('/$lang/admin/roles')({
  staticData: {
    title: 'admin:menu.roles',
    menuCode: 'roles',
  },
  component: RoleManage,
})
