import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { Layout, Button, Space, Typography, Dropdown } from 'antd'
import { UploadOutlined, UserOutlined, LogoutOutlined, DownOutlined, HeartOutlined, ShopOutlined, TeamOutlined, BulbOutlined, CheckCircleOutlined, MailOutlined, GiftOutlined, TrophyOutlined, WarningOutlined, GlobalOutlined } from '@ant-design/icons'
import { useAuthStore } from '../store/auth'
import { useTranslation } from 'react-i18next'
import { langPath } from '../utils/lang'
import NProgress from 'nprogress'

const { Header } = Layout

export function Navbar() {
  const { token, logout } = useAuthStore()
  const { t, i18n } = useTranslation()
  const { lang } = useParams({ from: '/$lang' })
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    NProgress.start()
  }

  const handleLangChange = (newLang: string) => {
    const currentPath = window.location.pathname
    const pathWithoutLang = currentPath.replace(/^\/(zh|en)/, '') || '/'
    navigate({ to: langPath(newLang, pathWithoutLang), replace: true })
  }

  const langItems = [
    { key: 'zh', label: '中文' },
    { key: 'en', label: 'English' },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to={langPath(lang, '/user')} style={{ textDecoration: 'none' }}>{t('nav.profile')}</Link>,
    },
    {
      key: 'checkin',
      icon: <CheckCircleOutlined />,
      label: <Link to={langPath(lang, '/user')} search={{ tab: 'checkin' }} style={{ textDecoration: 'none' }}>{t('nav.checkin')}</Link>,
    },
    {
      key: 'seeding',
      icon: <TeamOutlined />,
      label: <Link to={langPath(lang, '/user')} search={{ tab: 'seeding' }} style={{ textDecoration: 'none' }}>{t('nav.seeding')}</Link>,
    },
    {
      key: 'bookmarks',
      icon: <HeartOutlined />,
      label: <Link to={langPath(lang, '/user')} search={{ tab: 'bookmarks' }} style={{ textDecoration: 'none' }}>{t('nav.bookmarks')}</Link>,
    },
    {
      key: 'bonus',
      icon: <ShopOutlined />,
      label: <Link to={langPath(lang, '/user')} search={{ tab: 'bonus' }} style={{ textDecoration: 'none' }}>{t('nav.bonusShop')}</Link>,
    },
    { key: 'divider', type: 'divider' as const },
    {
      key: 'messages',
      icon: <MailOutlined />,
      label: <Link to={langPath(lang, '/messages')} style={{ textDecoration: 'none' }}>{t('nav.messages')}</Link>,
    },
    {
      key: 'invites',
      icon: <GiftOutlined />,
      label: <Link to={langPath(lang, '/invites')} style={{ textDecoration: 'none' }}>{t('nav.invites')}</Link>,
    },
    {
      key: 'medals',
      icon: <TrophyOutlined />,
      label: <Link to={langPath(lang, '/medals')} style={{ textDecoration: 'none' }}>{t('nav.medals')}</Link>,
    },
    {
      key: 'hr',
      icon: <WarningOutlined />,
      label: <Link to={langPath(lang, '/hr')} style={{ textDecoration: 'none' }}>{t('nav.hr')}</Link>,
    },
  ]

  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Space>
        <Link to={langPath(lang, '')} style={{ color: '#fff', textDecoration: 'none' }}>
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            {t('brand')}
          </Typography.Title>
        </Link>
        {token && (
          <Link to={langPath(lang, '/offers')}>
            <Button type="text" style={{ color: '#fff' }} icon={<BulbOutlined />}>
              {t('nav.candidates')}
            </Button>
          </Link>
        )}
        {token && (
          <Link to={langPath(lang, '/torrents/upload')}>
            <Button type="text" style={{ color: '#fff' }} icon={<UploadOutlined />}>
              {t('nav.upload')}
            </Button>
          </Link>
        )}
      </Space>

      <Space>
        <Dropdown menu={{ items: langItems, onClick: ({ key }) => handleLangChange(key) }} placement="bottomRight">
          <Button type="text" style={{ color: '#fff' }} icon={<GlobalOutlined />}>
            {i18n.language.startsWith('zh') ? '中文' : 'EN'} <DownOutlined />
          </Button>
        </Dropdown>
        {token ? (
          <>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button icon={<UserOutlined />}>
                {t('nav.userCenter')} <DownOutlined />
              </Button>
            </Dropdown>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              {t('nav.logout')}
            </Button>
          </>
        ) : (
          <>
            <Link to={langPath(lang, '/login')}>
              <Button type="primary">{t('nav.login')}</Button>
            </Link>
            <Link to={langPath(lang, '/register')}>
              <Button>{t('nav.register')}</Button>
            </Link>
          </>
        )}
      </Space>
    </Header>
  )
}
