import { Card, Descriptions, Tag, Space, Spin, Alert, Button, message } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCheckinStatus, checkin } from '../../api/user'
import { useTranslation } from 'react-i18next'

export default function Checkin() {
  const { t } = useTranslation('user')
  const queryClient = useQueryClient()

  const { data: status, isLoading } = useQuery({
    queryKey: ['checkin'],
    queryFn: () => getCheckinStatus(),
    select: (res) => res.data,
  })

  const mutation = useMutation({
    mutationFn: () => checkin(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['checkin'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      const d = res.data
      message.success(t('checkin.checkinSuccess', { bonus: d.bonus_earned, days: d.consecutive_days }))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('checkin.checkinFailed')),
  })

  if (isLoading) return <Spin />

  return (
    <Card title={t('checkin.title')}>
      <Space direction="vertical" size="middle">
        <Descriptions column={1} bordered size="small" style={{ maxWidth: 400 }}>
          <Descriptions.Item label={t('checkin.status')}>
            {status?.checked ? <Tag color="green">{t('checkin.checkedToday')}</Tag> : <Tag color="orange">{t('checkin.notChecked')}</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label={t('checkin.consecutiveDays')}>{status?.consecutive_days ?? 0} {t('checkin.days')}</Descriptions.Item>
          <Descriptions.Item label={t('checkin.totalDays')}>{status?.total_days ?? 0} {t('checkin.days')}</Descriptions.Item>
        </Descriptions>
        <Alert
          message={t('checkin.rewardHint')}
          type="info"
          showIcon
        />
        <Button type="primary" size="large" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={status?.checked}>
          {status?.checked ? t('checkin.alreadyChecked') : t('checkin.checkInNow')}
        </Button>
      </Space>
    </Card>
  )
}
