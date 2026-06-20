import { useCallback } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useThemeMode } from '../contexts/ThemeContext'

export function ThemeMenu() {
  const { themeMode, setThemeMode } = useThemeMode()

  const handleClick: MenuProps['onClick'] = useCallback(({ key }) => {
    if (key === 'light' || key === 'dark') {
      setThemeMode(key)
    }
  }, [setThemeMode])

  const items: MenuProps['items'] = [
    {
      key: 'theme',
      icon: themeMode === 'dark' ? <MoonOutlined /> : <SunOutlined />,
      label: themeMode === 'dark' ? '暗黑主题' : '浅色主题',
      children: [
        { key: 'light', icon: <SunOutlined />, label: '浅色主题' },
        { key: 'dark', icon: <MoonOutlined />, label: '暗黑主题' },
      ],
    },
  ]

  return (
    <Menu
      mode="horizontal"
      items={items}
      onClick={handleClick}
      selectable={false}
      style={{flexGrow: 1, justifyContent: "end"}}
    />
  )
}
