import { useState } from 'react'
import { Input, Popover, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { iconRegistry, PICKER_ICONS } from '../constants/icons'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface IconPickerProps {
  value?: string
  onChange?: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = search
    ? PICKER_ICONS.filter(name => iconRegistry[name] && name.toLowerCase().includes(search.toLowerCase()))
    : PICKER_ICONS.filter(name => iconRegistry[name])

  const SelectedIcon: LucideIcon | undefined = value ? iconRegistry[value] : undefined

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={['click']}
      placement="bottomLeft"
      content={
        <div style={{ width: 340 }}>
          <Input
            placeholder={t('iconPicker.searchPlaceholder')}
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <div
            style={{
              maxHeight: 260,
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
            }}
          >
            {filtered.map(name => {
              const Icon = iconRegistry[name] ?? iconRegistry.Circle
              const isSelected = value === name
              return (
                <div
                  key={name}
                  onClick={() => {
                    onChange?.(name)
                    setOpen(false)
                    setSearch('')
                  }}
                  title={name}
                  style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: 4,
                    border: isSelected ? '2px solid #1677ff' : '2px solid transparent',
                    background: isSelected ? '#e6f4ff' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = '#f5f5f5'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                    }
                  }}
                >
                  <Icon size={20} />
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div style={{ width: '100%', textAlign: 'center', padding: 16, color: '#999' }}>
                {t('iconPicker.empty')}
              </div>
            )}
          </div>
        </div>
      }
    >
      <Space style={{ cursor: 'pointer', width: '100%' }} onClick={() => setOpen(true)}>
        <Input
          value={value}
          readOnly
          placeholder={t('iconPicker.placeholder')}
          style={{ cursor: 'pointer', width: 200 }}
        />
        {SelectedIcon && <SelectedIcon size={20} />}
      </Space>
    </Popover>
  )
}
