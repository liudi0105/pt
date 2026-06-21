import { Card, Row, Col, Tag, Typography, Button, Spin, message, Empty, Tabs } from 'antd'
import { TrophyOutlined, CheckCircleOutlined, LockOutlined, ReloadOutlined, UploadOutlined, CloudUploadOutlined, TeamOutlined, StarOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { listAchievements, listUserAchievements, checkAchievements } from '../api/achievement'
import type { Achievement, UserAchievement } from '../types'

const { Title, Text } = Typography

const GROUP_ORDER = ['upload', 'seed', 'community', 'special', 'other']

function groupIcon(group: string) {
  switch (group) {
    case 'upload': return <UploadOutlined />
    case 'seed': return <CloudUploadOutlined />
    case 'community': return <TeamOutlined />
    case 'special': return <StarOutlined />
    default: return <TrophyOutlined />
  }
}

export function Achievements() {
  const { t } = useTranslation()
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => listAchievements(),
    select: (res) => res.data.achievements,
  })

  const { data: userAchievements } = useQuery({
    queryKey: ['user-achievements'],
    queryFn: () => listUserAchievements(),
    select: (res) => res.data.achievements,
  })

  const checkMut = useMutation({
    mutationFn: () => checkAchievements(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] })
      const count = res.data.unlocked.length
      if (count > 0) {
        message.success(t('achievement.unlocked', { count }))
      } else {
        message.info(t('achievement.noNew'))
      }
    },
    onError: () => message.error(t('achievement.checkFailed')),
  })

  const owned = new Set((userAchievements ?? []).map((ua: UserAchievement) => ua.achievement_id))

  const grouped = (achievements ?? []).reduce((acc: Record<string, Achievement[]>, a: Achievement) => {
    if (!acc[a.group]) acc[a.group] = []
    acc[a.group].push(a)
    return acc
  }, {})

  const groupKeys = Object.keys(grouped).sort(
    (a, b) => GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b),
  )

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}><TrophyOutlined /> {t('nav.achievements')}</Title>
        <Button icon={<ReloadOutlined />} onClick={() => checkMut.mutate()} loading={checkMut.isPending}>
          {t('achievement.check')}
        </Button>
      </div>

      {!achievements || achievements.length === 0 ? (
        <Empty description={t('achievement.empty')} />
      ) : (
        <Tabs
          items={groupKeys.map((group) => ({
            key: group,
            label: t(`achievementGroup.${group}`),
            children: (
              <Row gutter={[16, 16]}>
                {grouped[group].map((a: Achievement) => {
                  const has = owned.has(a.id)
                  const label = tCommon(`achievements.${a.code}`, { defaultValue: a.name || `Achievement ${a.code}` })
                  const description = tCommon(`achievementDescriptions.${a.code}`, { defaultValue: a.description })
                  return (
                    <Col key={a.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        style={{ textAlign: 'center', opacity: has ? 0.75 : 1 }}
                      >
                        <div style={{ fontSize: 40, marginBottom: 8 }}>
                          {groupIcon(a.group)}
                        </div>
                        <Title level={5}>{label}</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                          {description}
                        </Text>
                        {has ? (
                          <Tag color="green" icon={<CheckCircleOutlined />}>
                            {t('status.unlocked')}
                          </Tag>
                        ) : (
                          <Tag icon={<LockOutlined />}>{t('status.locked')}</Tag>
                        )}
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            ),
          }))}
        />
      )}
    </div>
  )
}
