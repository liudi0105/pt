import { Card, Descriptions, Tag, Typography, Space } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../api/user'
import { listMedals } from '../../api/medal'
import { listUserMedals } from '../../api/medal'
import { listAchievements, listUserAchievements } from '../../api/achievement'
import { useTranslation } from 'react-i18next'
import { useI18n } from '../../hooks/useI18n'
import { formatSize, calcRatio } from './utils'
import { getMedalIcon, getMedalColor, getAchievementIcon, getAchievementColor } from '../../constants/icons'
import dayjs from 'dayjs'
import type { Achievement, UserAchievement, Medal, UserMedal } from '../../types'

const { Text } = Typography

export default function Profile() {
  const { t, i18n } = useTranslation('user')
  const { t: tCommon } = useTranslation()
  const lang = i18n.language?.startsWith('zh') ? 'zh' : 'en'

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const { data: medals } = useQuery({
    queryKey: ['medals'],
    queryFn: () => listMedals(),
    select: (res) => res.data.medals,
  })

  const { data: userMedalList } = useQuery({
    queryKey: ['user-medals'],
    queryFn: () => listUserMedals(),
    select: (res) => res.data.medals,
  })

  const { data: userAchievements } = useQuery({
    queryKey: ['user-achievements'],
    queryFn: () => listUserAchievements(),
    select: (res) => res.data.achievements,
  })

  const { data: allAchievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => listAchievements(),
    select: (res) => res.data.achievements,
  })

  const achievementMap = new Map<number, Achievement>()
  if (allAchievements) {
    for (const a of allAchievements) {
      achievementMap.set(a.code, a)
    }
  }

  const i18nLevel = useI18n('user_level')
  const levelCode = profile?.level_code
  const levelLabel = levelCode !== undefined
    ? i18nLevel.getLabel(String(levelCode)) || profile?.level_label || `Level ${levelCode}`
    : '-'

  const wearingMedals: Medal[] = (userMedalList ?? [])
    .filter((um: UserMedal) => um.is_wearing)
    .map((um: UserMedal) => medals?.find((m: Medal) => m.id === um.medal_id))
    .filter((m): m is Medal => m != null)


  return (
    <Card>
      {profile && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {wearingMedals.length > 0 && (
            <Card size="small" title={<Text type="secondary">{tCommon('medal.wearing')}</Text>}>
              <Space size="middle" wrap>
                {wearingMedals.map((m: Medal) => (
                  <Space key={m.id} direction="vertical" align="center" size={4}>
                    {(() => { const Icon = getMedalIcon(m.code, m.image); return <Icon size={32} color={getMedalColor(m.code, m.color)} /> })()}
                    <Text strong>
                      {m.i18n?.[lang]?.label || `Medal ${m.code}`}
                    </Text>
                  </Space>
                ))}
              </Space>
            </Card>
          )}

          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label={t('profile.username')}>{profile.username}</Descriptions.Item>
            <Descriptions.Item label={t('profile.email')}>{profile.email}</Descriptions.Item>
            <Descriptions.Item label={t('profile.role')}>
              <Tag>{profile.role}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.level')}>{levelLabel}</Descriptions.Item>
            <Descriptions.Item label={t('profile.bonus')}>
              <Text type="warning" strong>{profile.bonus?.toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.uploaded')}>{formatSize(profile.upload_bytes)}</Descriptions.Item>
            <Descriptions.Item label={t('profile.downloaded')}>{formatSize(profile.download_bytes)}</Descriptions.Item>
            <Descriptions.Item label={t('profile.ratio')}>
              {calcRatio(profile.upload_bytes, profile.download_bytes)}
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.snatches')}>{profile.total_snatches ?? '-'}</Descriptions.Item>
            <Descriptions.Item label={t('profile.seeding')}>{profile.seeding_count ?? '-'}</Descriptions.Item>
            <Descriptions.Item label={t('profile.passkey')}>
              <code>{profile.passkey}</code>
            </Descriptions.Item>
            <Descriptions.Item label={t('profile.joined')}>{dayjs(profile.created_at).format('YYYY-MM-DD')}</Descriptions.Item>
          </Descriptions>

          {(userAchievements && userAchievements.length > 0) && (
            <Card size="small" title={<Text type="secondary">{tCommon('nav.achievements')}</Text>}>
              <Space size="middle" wrap>
                {(userAchievements as UserAchievement[]).map((ua) => {
                  const a = achievementMap.get(ua.achievement_code ?? 0)
                  return (
                    <Space key={ua.id} direction="vertical" align="center" size={4}>
                      <Text style={{ fontSize: 24 }}>
                        {a ? (() => { const Icon = getAchievementIcon(a.code, a.icon); return <Icon size={24} color={getAchievementColor(a.code, a.color)} /> })() : null}
                      </Text>
                      <Text>
                        {tCommon(`achievements.${ua.achievement_code}`, { defaultValue: `Achievement ${ua.achievement_code}` })}
                      </Text>
                    </Space>
                  )
                })}
              </Space>
            </Card>
          )}
        </Space>
      )}
    </Card>
  )
}