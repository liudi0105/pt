import { Card, Row, Col, Tag, Typography, Button, message, Spin } from 'antd'
import { TrophyOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { listMedals, buyMedal, listUserMedals } from '../api/medal'
import type { Medal, UserMedal } from '../types'

const { Title, Text } = Typography

export function Medals() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

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

  const owned = new Set((userMedals ?? []).map((um: UserMedal) => um.medal_id))

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />

  return (
    <div>
      <Title level={3}><TrophyOutlined /> {t('nav.medals')}</Title>
      <Row gutter={[16, 16]}>
        {(medals ?? []).map((m: Medal) => {
          const has = owned.has(m.id)
          return (
            <Col key={m.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ textAlign: 'center', opacity: has ? 0.7 : 1 }}
                actions={has ? [<><CheckCircleOutlined /> {t('status.active')}</>] : [
                  <Button type="primary" size="small" onClick={() => buyMut.mutate(m.id)} loading={buyMut.isPending}>
                    {t('medal.buy')} ({m.price} {t('medal.bonus')})
                  </Button>,
                ]}
              >
                <div style={{ fontSize: 48, marginBottom: 8 }}>🏅</div>
                <Title level={5}>{m.name}</Title>
                <Text type="secondary">{m.description || t('medal.noDescription')}</Text>
                <div style={{ marginTop: 8 }}>
                  {has ? <Tag color="green">{t('status.active')}</Tag> : <Tag>{t('medal.price')}: {m.price}</Tag>}
                </div>
              </Card>
            </Col>
          )
        })}
        {(!medals || medals.length === 0) && (
          <Col span={24} style={{ textAlign: 'center', padding: 48 }}>
            <Text type="secondary">{t('medal.empty')}</Text>
          </Col>
        )}
      </Row>
    </div>
  )
}
