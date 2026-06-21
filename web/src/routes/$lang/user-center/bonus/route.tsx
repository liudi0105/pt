import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/user-center/bonus')({
  staticData: {
    title: 'user:menu.bonus',
    menuCode: 'user-bonus',
    menuSort: 30,
  },
  component: () => <Outlet />,
})
