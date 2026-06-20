import { createFileRoute } from '@tanstack/react-router'
import { LuckyDraw } from '../../../../pages/LuckyDraw'

export const Route = createFileRoute('/$lang/user-center/bonus/lucky-draw')({
  staticData: {
    title: 'common:nav.luckyDraw',
    menuCode: 'lucky-draw',
    menuSort: 20,
  },
  component: LuckyDraw,
})
