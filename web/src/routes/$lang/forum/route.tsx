import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/forum')({
  staticData: {
    title: 'common:nav.forum',
    menuCode: 'forum',
    menuIcon: 'CommentOutlined',
    menuSort: 5,
  },
  component: () => <Outlet />,
})
