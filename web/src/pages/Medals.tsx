import { useState } from 'react'
import { Card, Row, Col, Tag, Typography, Button, message, Spin, Space, Popconfirm } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { listMedals, buyMedal, listUserMedals, wearMedal, unwearMedal } from '../api/medal'
import { getMedalIcon, getMedalColor } from '../constants/icons'
import type { Medal, UserMedal } from '../types'

const { Title, Text } = Typography

export function Medals() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('zh') ? 'zh' : 'en'
  const queryClient = useQueryClient()
  const [ownedOnly, setOwnedOnly] = useState(false)

  const { data: medals, isLoading } = useQuery({
    queryKey: ['medals'],
    queryFn: () => listMedals(),
    select: (res) => res.data.medals,
  })

  const { data: userMedals } = useQuery({
    queryKey: ['user-medals'],
    queryFn: () => listUserMedals(),
    select: (res) => res.data.medals,
  })

  const buyMut = useMutation({
    mutationFn: (id: number) => buyMedal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-medals'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      message.success(t('medal.purchased'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('medal.purchaseFailed')),
  })

  const wearMut = useMutation({
    mutationFn: (id: number) => wearMedal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-medals'] })
      message.success(t('medal.wearing'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('medal.wearFailed')),
  })

  const unwearMut = useMutation({
    mutationFn: (id: number) => unwearMedal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-medals'] })
      message.success(t('medal.unwearing'))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('medal.unwearFailed')),
  })

  const owned = new Set((userMedals ?? []).map((um: UserMedal) => um.medal_id))
  const wearing = new Set(
    (userMedals ?? []).filter((um: UserMedal) => um.is_wearing).map((um: UserMedal) => um.medal_id)
  )
  const filtered = (medals ?? []).filter((m: Medal) => (ownedOnly ? owned.has(m.id) : true))

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />

  return (
    <div>
      <Title level={3}>{t('nav.medals')}</Title>

      <Space style={{ marginBottom: 16 }}>
        <Button
          type={ownedOnly ? 'primary' : 'default'}
          icon={<EyeOutlined />}
          onClick={() => setOwnedOnly((v) => !v)}
        >
          {t('medal.ownedOnly')}
        </Button>
      </Space>

      <Row gutter={[16, 16]}>
        {filtered.map((m: Medal) => {
          const has = owned.has(m.id)
          const isWearing = wearing.has(m.id)
          const i18nMap = m.i18n?.[lang]
          const medalLabel = i18nMap?.label || `Medal ${m.code}`
          const medalDescription = i18nMap?.description || m.description

          let action
          if (!has) {
            action = (
              <Popconfirm key="buy" title={t('medal.confirmBuy')} onConfirm={() => buyMut.mutate(m.id)}>
                <Button type="primary" size="small" loading={buyMut.isPending && buyMut.variables === m.id}>
                  {t('medal.buy')} ({m.price} {t('medal.bonus')})
                </Button>
              </Popconfirm>
            )
          } else if (isWearing) {
            action = (
              <Button
                key="unwear"
                size="small"
                loading={unwearMut.isPending && unwearMut.variables === m.id}
                onClick={() => unwearMut.mutate(m.id)}
              >
                {t('medal.unwear')}
              </Button>
            )
          } else {
            action = (
              <Button
                key="wear"
                size="small"
                loading={wearMut.isPending && wearMut.variables === m.id}
                onClick={() => wearMut.mutate(m.id)}
              >
                {t('medal.wear')}
              </Button>
            )
          }

          return (
            <Col key={m.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ textAlign: 'center' }}
                actions={[action]}
              >
                  {(() => {
                    const Icon = getMedalIcon(m.code, m.image); return <Icon size={48} color={getMedalColor(m.code, m.color)} />
                  })()}
                <Title level={5}>{medalLabel}</Title>
                <Text type="secondary">{medalDescription || t('medal.noDescription')}</Text>
                <div style={{ marginTop: 8 }}>
                  {isWearing ? (
                    <Tag color="gold">{t('medal.wearing')}</Tag>
                  ) : has ? (
                    <Tag color="green">{t('status.active')}</Tag>
                  ) : (
                    <Tag>{t('medal.price')}: {m.price}</Tag>
                  )}
                </div>
              </Card>
            </Col>
          )
        })}
        {filtered.length === 0 && (
          <Col span={24} style={{ textAlign: 'center', padding: 48 }}>
            <Text type="secondary">{t('medal.empty')}</Text>
          </Col>
        )}
      </Row>
    </div>
  )
}