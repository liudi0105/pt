import { createFileRoute, Outlet, Link, useLocation, useParams } from '@tanstack/react-router'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  FlagOutlined,
  GiftOutlined,
  SafetyOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { AdminHeader } from '../../components/AdminHeader'
import { useTranslation } from 'react-i18next'

const { Sider, Content } = Layout

export const Route = createFileRoute('/$lang/admin')({
  component: () => {
    const location = useLocation()
    const { lang } = useParams({ from: '/$lang' })
    const selectedKey = '/' + location.pathname.split('/').slice(1, 3).join('/')
    const { t } = useTranslation('admin')

    const menuItems = [
      { key: '/admin', icon: <DashboardOutlined />, label: <Link to={`/${lang}/admin`}>{t('menu.dashboard')}</Link> },
      { key: '/admin/users', icon: <UserOutlined />, label: <Link to={`/${lang}/admin/users`}>{t('menu.users')}</Link> },
      { key: '/admin/roles', icon: <SafetyOutlined />, label: <Link to={`/${lang}/admin/roles`}>{t('menu.roles')}</Link> },
      { key: '/admin/settings', icon: <SettingOutlined />, label: <Link to={`/${lang}/admin/settings`}>{t('menu.settings')}</Link> },
      { key: '/admin/dict', icon: <BookOutlined />, label: <Link to={`/${lang}/admin/dict`}>{t('menu.dictionary')}</Link> },
      { key: '/admin/levels', icon: <TrophyOutlined />, label: <Link to={`/${lang}/admin/levels`}>{t('menu.levels')}</Link> },
      { key: '/admin/promotions', icon: <ThunderboltOutlined />, label: <Link to={`/${lang}/admin/promotions`}>{t('menu.promotions')}</Link> },
      { key: '/admin/reports', icon: <FlagOutlined />, label: <Link to={`/${lang}/admin/reports`}>{t('menu.reports')}</Link> },
      { key: '/admin/medals', icon: <GiftOutlined />, label: <Link to={`/${lang}/admin/medals`}>{t('menu.medals')}</Link> },
    ]

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <AdminHeader />
        <Layout>
          <Sider width={220} theme="dark">
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              style={{ borderRight: 0 }}
            />
          </Sider>
          <Content style={{ padding: 24, background: '#f5f5f5' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    )
  },
})
