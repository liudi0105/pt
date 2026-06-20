import { createFileRoute } from '@tanstack/react-router'
import { Offers } from '../../../pages/Offers'

export const Route = createFileRoute('/$lang/offers')({
  staticData: {
    title: 'common:nav.offers',
    menuCode: 'offers',
    menuIcon: 'BulbOutlined',
    menuSort: 20,
  },
  component: Offers,
})
