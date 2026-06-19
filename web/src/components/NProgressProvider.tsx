import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import NProgress from 'nprogress'
import type { ReactNode } from 'react'

export function NProgressProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const unsubLoad = router.subscribe('onBeforeLoad', () => NProgress.start())
    const unsubResolve = router.subscribe('onResolved', () => NProgress.done())
    return () => {
      unsubLoad()
      unsubResolve()
    }
  }, [router])

  return children
}
