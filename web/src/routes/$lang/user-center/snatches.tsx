import { createFileRoute } from '@tanstack/react-router'
import Snatches from '../../../pages/user-center/Snatches'

export const Route = createFileRoute('/$lang/user-center/snatches')({
  staticData: {
    title: 'user:menu.snatches',
    menuCode: 'user-snatches',
    menuSort: 120,
  },
  component: Snatches,
})
