import { createFileRoute } from '@tanstack/react-router'
import Seeding from '../../../pages/user-center/Seeding'

export const Route = createFileRoute('/$lang/user-center/seeding')({
  staticData: {
    title: 'user:menu.seeding',
    menuCode: 'user-seeding',
    menuSort: 30,
  },
  component: Seeding,
})
