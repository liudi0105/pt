import { createFileRoute } from '@tanstack/react-router'
import { UserCenter } from '../../pages/UserCenter'

export const Route = createFileRoute('/$lang/user_')({
  staticData: {
    title: 'common:nav.userCenter',
  },
  component: UserCenter,
})
