import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/torrents')({
  staticData: {
    title: 'common:nav.torrents',
    menuCode: 'torrents',
    menuIcon: 'SearchOutlined',
    menuSort: 10,
  },
  component: () => <Outlet />,
})
