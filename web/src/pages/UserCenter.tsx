import { useEffect, useState } from 'react'
import { Typography, Tabs } from 'antd'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useAuthStore } from '../store/auth'
import { useTranslation } from 'react-i18next'
import Profile from './user-center/Profile'
import Checkin from './user-center/Checkin'
import Settings from './user-center/Settings'
import Snatches from './user-center/Snatches'
import Seeding from './user-center/Seeding'
import Bookmarks from './user-center/Bookmarks'
import BonusShop from './user-center/BonusShop'

const { Title } = Typography

export function UserCenter() {
  const { t } = useTranslation('user')
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const { token } = useAuthStore()
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('tab') || 'profile'
  })

  useEffect(() => {
    if (!token) navigate({ to: '/$lang/login', params: { lang } })
  }, [token, navigate])

  const handleTabChange = (key: string) => {
    setActiveTab(key)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', key)
    window.history.replaceState({}, '', url.toString())
  }

  const tabItems = [
    { key: 'profile', label: t('tabs.profile'), children: <Profile /> },
    { key: 'checkin', label: t('tabs.checkin'), children: <Checkin /> },
    { key: 'settings', label: t('tabs.settings'), children: <Settings /> },
    { key: 'snatches', label: t('tabs.snatches'), children: <Snatches /> },
    { key: 'seeding', label: t('tabs.seeding'), children: <Seeding /> },
    { key: 'bookmarks', label: t('tabs.bookmarks'), children: <Bookmarks /> },
    { key: 'bonus', label: t('tabs.bonusShop'), children: <BonusShop /> },
  ]

  return (
    <div>
      <Title level={3}>{t('title')}</Title>
      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </div>
  )
}
