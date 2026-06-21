import { createFileRoute } from '@tanstack/react-router'
import { UserManage } from '../../../pages/admin/UserManage'
import { adminListUsers } from '../../../api/admin'

export const Route = createFileRoute('/$lang/admin/users')({
  staticData: {
    title: 'admin:menu.users',
    menuCode: 'users',
    menuSort: 20,
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['admin', 'users', 1, '', '', ''],
      queryFn: () => adminListUsers({ page: 1, page_size: 20 }),
    })
  },
  component: UserManage,
})
