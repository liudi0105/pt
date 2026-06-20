import { createFileRoute } from '@tanstack/react-router'
import { Medals } from '../../../pages/Medals'

export const Route = createFileRoute('/$lang/user-center/medals')({
  staticData: {
    title: 'user:menu.medals',
    menuCode: 'user-medals',
    menuSort: 90,
  },
  component: Medals,
})
