import { createFileRoute } from '@tanstack/react-router'
import { Register } from '../../pages/Register'

export const Route = createFileRoute('/$lang/register')({
  staticData: {
    title: 'common:nav.register',
  },
  component: Register,
})
