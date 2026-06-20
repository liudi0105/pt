import { createFileRoute } from '@tanstack/react-router'
import Checkin from '../../../pages/user-center/Checkin'

export const Route = createFileRoute('/$lang/user-center/checkin')({
  staticData: {
    title: 'user:menu.checkin',
    menuCode: 'user-checkin',
    menuSort: 20,
  },
  component: Checkin,
})
