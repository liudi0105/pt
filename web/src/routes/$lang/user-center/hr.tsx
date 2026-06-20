import { createFileRoute } from '@tanstack/react-router'
import { HR } from '../../../pages/HR'

export const Route = createFileRoute('/$lang/user-center/hr')({
  staticData: {
    title: 'user:menu.hr',
    menuCode: 'user-hr',
    menuSort: 100,
  },
  component: HR,
})
