import { createFileRoute } from '@tanstack/react-router'
import { HR } from '../../pages/HR'

export const Route = createFileRoute('/$lang/hr')({
  staticData: {
    title: 'H&R',
  },
  component: HR,
})
