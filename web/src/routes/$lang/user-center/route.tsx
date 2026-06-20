import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/user-center')({
  staticData: {
    title: 'common:nav.userCenter',
    menuCode: 'user-center',
    menuIcon: 'UserOutlined',
    menuSort: 25,
  },
  component: () => <Outlet />,
})
