import { createRootRoute, HeadContent, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Layout } from 'antd'
import { Navbar } from '../components/Navbar'
import { NProgressProvider } from '../components/NProgressProvider'
import { normalizeLang } from '../utils/lang'
import 'nprogress/nprogress.css'

const { Content } = Layout

const APP_NAME = 'pt-web'

function getLangFromCookie(): string {
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
  return normalizeLang(match ? decodeURIComponent(match[1]) : undefined) ?? 'zh'
}

export const Route = createRootRoute({
  head: (ctx) => {
    const lastMatch = ctx.matches[ctx.matches.length - 1]
    const title = lastMatch?.staticData?.title

    return {
      meta: [
        {
          title: title ? `${title} - ${APP_NAME}` : APP_NAME,
        },
      ],
    }
  },
  component: RootLayout,
})

function RootLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  const hasLangPrefix = /^\/(zh|en)(\/|$)/.test(pathname)

  useEffect(() => {
    if (!hasLangPrefix) {
      const lang = getLangFromCookie()
      navigate({ to: `/${lang}${pathname}`, replace: true })
    }
  }, [hasLangPrefix, pathname, navigate])

  if (!hasLangPrefix) {
    return null
  }

  const isAdmin = pathname.startsWith('/zh/admin') || pathname.startsWith('/en/admin')

  return (
    <NProgressProvider>
      <HeadContent />
      {isAdmin ? (
        <Outlet />
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar />
          <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <Outlet />
          </Content>
        </Layout>
      )}
    </NProgressProvider>
  )
}
