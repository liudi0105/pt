import { Card, Descriptions, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../api/user'
import { useTranslation } from 'react-i18next'
import { useI18n } from '../../hooks/useI18n'
import { formatSize, calcRatio } from './utils'
import dayjs from 'dayjs'

export default function Profile() {
  const { t } = useTranslation('user')
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const i18nLevel = useI18n('user_level')
  const levelCode = profile?.level_code
  const levelLabel = levelCode !== undefined
    ? i18nLevel.getLabel(String(levelCode)) || profile?.level_label || `Level ${levelCode}`
    : '-'

  return (
    <Card>
      {profile && (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('profile.username')}>{profile.username}</Descriptions.Item>
          <Descriptions.Item label={t('profile.email')}>{profile.email}</Descriptions.Item>
          <Descriptions.Item label={t('profile.role')}>
            <Tag>{profile.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.level')}>{levelLabel}</Descriptions.Item>
          <Descriptions.Item label={t('profile.bonus')}>
            <span style={{ color: '#faad14', fontWeight: 'bold' }}>{profile.bonus?.toFixed(2)}</span>
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.uploaded')}>{formatSize(profile.upload_bytes)}</Descriptions.Item>
          <Descriptions.Item label={t('profile.downloaded')}>{formatSize(profile.download_bytes)}</Descriptions.Item>
          <Descriptions.Item label={t('profile.ratio')}>
            {calcRatio(profile.upload_bytes, profile.download_bytes)}
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.snatches')}>{profile.total_snatches ?? '-'}</Descriptions.Item>
          <Descriptions.Item label={t('profile.seeding')}>{profile.seeding_count ?? '-'}</Descriptions.Item>
          <Descriptions.Item label={t('profile.passkey')}>
            <code style={{ fontSize: 12 }}>{profile.passkey}</code>
          </Descriptions.Item>
          <Descriptions.Item label={t('profile.joined')}>{dayjs(profile.created_at).format('YYYY-MM-DD')}</Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  )
}
