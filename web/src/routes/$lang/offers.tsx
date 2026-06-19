import { createFileRoute } from '@tanstack/react-router'
import { Offers } from '../../pages/Offers'

export const Route = createFileRoute('/$lang/offers')({
  staticData: {
    title: 'Offers',
  },
  component: Offers,
})
