import { createFileRoute } from '@tanstack/react-router'
import Profile from '../../../pages/user-center/Profile'

export const Route = createFileRoute('/$lang/user-center/')({
  staticData: {
    title: 'user:menu.profile',
    menuCode: 'user-profile',
    menuSort: 10,
  },
  component: Profile,
})
