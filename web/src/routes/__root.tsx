import { createRootRoute, HeadContent, Outlet, useLocation, useMatches } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Layout, Menu, Spin } from 'antd'
import {
  DashboardOutlined, UserOutlined, BookOutlined, TrophyOutlined,
  FlagOutlined, GiftOutlined, SafetyOutlined, SettingOutlined,
  ThunderboltOutlined, ControlOutlined, DatabaseOutlined, NotificationOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { Navbar } from '../components/Navbar'
import { NProgressProvider } from '../components/NProgressProvider'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { langPath, normalizeLang } from '../utils/lang'
import i18n, { i18nReady } from '../i18n'
import { useAuthStore } from '../store/auth'
import { getProfile } from '../api/user'
import 'nprogress/nprogress.css'

const { Content, Sider } = Layout

const APP_NAME = 'pt-web'

function getLangFromCookie(): string {
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
  return normalizeLang(match ? decodeURIComponent(match[1]) : undefined) ?? 'zh'
}

export const Route = createRootRoute({
  loader: async () => {
    await i18nReady
    const { token, user } = useAuthStore.getState()
    if (token && !user) {
      try {
        const res = await getProfile()
        useAuthStore.getState().setAuth(token, res.data)
      } catch {
        // token invalid, ignore
      }
    }
    return { ready: true }
  },
  pendingComponent: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  ),
  head: (ctx) => {
    const lastMatch = ctx.matches[ctx.matches.length - 1]
    const titleKey = lastMatch?.staticData?.title
    const title = titleKey ? i18n.t(titleKey) : ''

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
  const pathname = location.pathname

  const hasLangPrefix = /^\/(zh|en)(\/|$)/.test(pathname)

  useEffect(() => {
    if (!hasLangPrefix) {
      const lang = getLangFromCookie()
      window.location.assign(langPath(lang, pathname) + window.location.search)
    }
  }, [hasLangPrefix, pathname])

  if (!hasLangPrefix) {
    return null
  }

  const matches = useMatches()

  const isAdmin = matches.some(m => m.staticData?.menuCode === 'admin')
  const lang = pathname.startsWith('/zh') ? 'zh' : 'en'

  const selectedKeys = matches
    .map(m => m.staticData?.menuCode)
    .filter(Boolean) as string[]

  const { t } = useTranslation('admin')

  const siderItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/$lang/admin" params={{ lang }}>{t('menu.dashboard')}</Link> },
    { key: 'users', icon: <UserOutlined />, label: <Link to="/$lang/admin/users" params={{ lang }}>{t('menu.users')}</Link> },
    { key: 'roles', icon: <SafetyOutlined />, label: <Link to="/$lang/admin/roles" params={{ lang }}>{t('menu.roles')}</Link> },
    { key: 'settings', icon: <SettingOutlined />, label: <Link to="/$lang/admin/settings" params={{ lang }}>{t('menu.settings')}</Link> },
    { key: 'dict', icon: <BookOutlined />, label: <Link to="/$lang/admin/dict" params={{ lang }}>{t('menu.dictionary')}</Link> },
    { key: 'levels', icon: <TrophyOutlined />, label: <Link to="/$lang/admin/levels" params={{ lang }}>{t('menu.levels')}</Link> },
    { key: 'promotions', icon: <ThunderboltOutlined />, label: <Link to="/$lang/admin/promotions" params={{ lang }}>{t('menu.promotions')}</Link> },
    { key: 'reports', icon: <FlagOutlined />, label: <Link to="/$lang/admin/reports" params={{ lang }}>{t('menu.reports')}</Link> },
    { key: 'medals', icon: <GiftOutlined />, label: <Link to="/$lang/admin/medals" params={{ lang }}>{t('menu.medals')}</Link> },
    { key: 'client-risk', icon: <ControlOutlined />, label: <Link to="/$lang/admin/client-risk-control" params={{ lang }}>{t('menu.clientRisk')}</Link> },
    { key: 'resources', icon: <DatabaseOutlined />, label: <Link to="/$lang/admin/operations-resources" params={{ lang }}>{t('menu.resources')}</Link> },
    { key: 'announcements', icon: <NotificationOutlined />, label: <Link to="/$lang/admin/announcements" params={{ lang }}>{t('menu.announcements')}</Link> },
    { key: 'bonus', icon: <DollarOutlined />, label: <Link to="/$lang/admin/bonus" params={{ lang }}>{t('menu.bonus')}</Link> },
  ]

  return (
    <NProgressProvider>
      <HeadContent />
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Layout>
          {isAdmin && (
            <Sider width={220} theme="dark">
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={selectedKeys}
                items={siderItems}
                style={{ borderRight: 0 }}
              />
            </Sider>
          )}
          <Content style={
            isAdmin
              ? { padding: 24, background: '#f5f5f5' }
              : { padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }
          }>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </NProgressProvider>
  )
}
