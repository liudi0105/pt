import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/admin')({
  staticData: {
    title: 'common:nav.adminPanel',
    menuCode: 'admin',
  },
  component: () => <Outlet />,
})
