import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/forum')({
  staticData: {
    title: 'common:nav.forum',
    menuCode: 'forum',
    menuIcon: 'CommentOutlined',
    menuSort: 30,
  },
  component: () => <Outlet />,
})
