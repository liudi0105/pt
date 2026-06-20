import { createFileRoute } from '@tanstack/react-router'
import { BigSmall } from '../../../../pages/BigSmall'

export const Route = createFileRoute('/$lang/user-center/bonus/big-small')({
  staticData: {
    title: 'common:nav.bigSmall',
    menuCode: 'big-small',
    menuSort: 30,
  },
  component: BigSmall,
})
