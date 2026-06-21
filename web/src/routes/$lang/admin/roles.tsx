import { createFileRoute } from '@tanstack/react-router'
import { RoleManage } from '../../../pages/admin/RoleManage'
import { listRoles, listPermissions } from '../../../api/admin'

export const Route = createFileRoute('/$lang/admin/roles')({
  staticData: {
    title: 'admin:menu.roles',
    menuCode: 'roles',
    menuSort: 25,
  },
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['admin-roles'],
        queryFn: () => listRoles(),
      }),
      queryClient.ensureQueryData({
        queryKey: ['admin-permissions'],
        queryFn: () => listPermissions(),
      }),
    ])
  },
  component: RoleManage,
})
