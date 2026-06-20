import { useCallback } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { langPath } from '../utils/lang'

export function LanguageMenu() {
  const { i18n } = useTranslation()

  const handleClick: MenuProps['onClick'] = useCallback(({ key }) => {
    const currentPath = window.location.pathname
    const pathWithoutLang = currentPath.replace(/^\/(zh|en)/, '') || '/'
    if (key === 'zh' || key === 'en') {
      window.location.assign(langPath(key, pathWithoutLang) + window.location.search)
    }
  }, [])

  const items: MenuProps['items'] = [
    {
      key: 'lang',
      icon: <GlobalOutlined />,
      label: i18n.language.startsWith('zh') ? '中文' : 'EN',
      children: [
        { key: 'zh', label: '中文' },
        { key: 'en', label: 'English' },
      ],
    },
  ]

  return (
    <Menu
      mode="horizontal"
      items={items}
      onClick={handleClick}
      selectable={false}
    />
  )
}
