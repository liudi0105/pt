import { createFileRoute } from '@tanstack/react-router'
import { Login } from '../../pages/Login'

export const Route = createFileRoute('/$lang/login')({
  staticData: {
    title: '登录',
  },
  component: Login,
})
