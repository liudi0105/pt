import { createFileRoute } from '@tanstack/react-router'
import BonusShop from '../../../../pages/user-center/BonusShop'

export const Route = createFileRoute('/$lang/user-center/bonus/')({
  staticData: {
    title: 'user:menu.bonus',
    menuCode: 'user-bonus-exchange',
    menuSort: 5,
  },
  component: BonusShop,
})
