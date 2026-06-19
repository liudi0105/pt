import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { Layout, Button, Space, Typography, Dropdown } from 'antd'
import { LogoutOutlined, UserOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons'
import { useAuthStore } from '../store/auth'
import { useTranslation } from 'react-i18next'
import { langPath } from '../utils/lang'
import NProgress from 'nprogress'

const { Header } = Layout

export function AdminHeader() {
  const { token, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { lang } = useParams({ from: '/$lang' })
  const langItems = [
    { key: 'zh', label: '中文' },
    { key: 'en', label: 'English' },
  ]

  const handleLogout = () => {
    logout()
    navigate({ to: langPath(lang, ''), replace: true })
    NProgress.start()
  }

  const handleLangChange = (newLang: string) => {
    const currentPath = window.location.pathname
    const pathWithoutLang = currentPath.replace(/^\/(zh|en)/, '') || '/'
    navigate({ to: langPath(newLang, pathWithoutLang), replace: true })
  }

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#001529',
        padding: '0 24px',
        height: 48,
        lineHeight: '48px',
      }}
    >
      <Space size="middle">
        <Link to={langPath(lang, '')} style={{ color: '#fff', textDecoration: 'none' }}>
          <Typography.Text strong style={{ color: '#fff', fontSize: 16 }}>
            {t('brand')}
          </Typography.Text>
        </Link>
        <Typography.Text type="secondary" style={{ color: 'rgba(255,255,255,0.45)' }}>
          /
        </Typography.Text>
        <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
          {t('nav.adminPanel')}
        </Typography.Text>
      </Space>

      <Space>
        <Dropdown menu={{ items: langItems, onClick: ({ key }) => handleLangChange(key) }} placement="bottomRight">
          <Button type="text" style={{ color: 'rgba(255,255,255,0.85)' }} icon={<GlobalOutlined />}>
            {i18n.language.startsWith('zh') ? '中文' : 'EN'} <DownOutlined />
          </Button>
        </Dropdown>
        {token && user && (
          <>
            <UserOutlined style={{ color: 'rgba(255,255,255,0.65)' }} />
            <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              {user.username}
            </Typography.Text>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {t('nav.logout')}
            </Button>
          </>
        )}
      </Space>
    </Header>
  )
}
