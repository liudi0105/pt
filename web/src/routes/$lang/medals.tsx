import { createFileRoute } from '@tanstack/react-router'
import { Medals } from '../../pages/Medals'

export const Route = createFileRoute('/$lang/medals')({
  staticData: {
    title: '勋章',
  },
  component: Medals,
})
