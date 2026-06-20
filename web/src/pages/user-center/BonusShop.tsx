import { useState } from 'react'
import { Card, Descriptions, InputNumber, Space, Button, message, Row, Col, Statistic } from 'antd'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, buyUpload, buyDownload, getSeedBonusRate } from '../../api/user'
import { useTranslation } from 'react-i18next'
import { formatSize } from './utils'

const bonusPerGB = 100

function UploadExchange() {
  const { t } = useTranslation('user')
  const [spent, setSpent] = useState(100)
  const queryClient = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const mutation = useMutation({
    mutationFn: (bonus: number) => buyUpload(bonus),
    onSuccess: (res) => {
      const d = res.data
      message.success(t('bonusShop.buySuccess', { size: formatSize(d.upload_bytes), bonus: d.bonus_spent }))
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (err: any) => {
      message.error(err.response?.data?.error || t('bonusShop.buyFailed'))
    },
  })

  const uploadBytes = Math.floor(spent / bonusPerGB * 1024 * 1024 * 1024)

  return (
    <Card size="small" type="inner" title={t('bonusShop.buyUpload')} style={{ maxWidth: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <span>{t('bonusShop.spendBonus')} </span>
          <InputNumber
            min={bonusPerGB}
            step={bonusPerGB}
            value={spent}
            onChange={(v) => setSpent(v || bonusPerGB)}
            style={{ width: 150 }}
          />
        </div>
        <div>
          {t('bonusShop.youReceive')} <strong>{formatSize(uploadBytes)}</strong> {t('bonusShop.uploadCredit')}
        </div>
        <Button
          type="primary"
          onClick={() => mutation.mutate(spent)}
          loading={mutation.isPending}
          disabled={(profile?.bonus ?? 0) < spent}
        >
          {t('bonusShop.buyNow')}
        </Button>
        {(profile?.bonus ?? 0) < spent && (
          <span style={{ color: '#ff4d4f' }}>{t('bonusShop.insufficientBonus')}</span>
        )}
      </Space>
    </Card>
  )
}

function DownloadExchange() {
  const { t } = useTranslation('user')
  const [spent, setSpent] = useState(100)
  const queryClient = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const mutation = useMutation({
    mutationFn: (bonus: number) => buyDownload(bonus),
    onSuccess: (res) => {
      const d = res.data
      message.success(t('bonusShop.buyDownloadSuccess', { size: formatSize(d.download_bytes), bonus: d.bonus_spent }))
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (err: any) => {
      message.error(err.response?.data?.error || t('bonusShop.buyFailed'))
    },
  })

  const downloadBytes = Math.floor(spent / bonusPerGB * 1024 * 1024 * 1024)

  return (
    <Card size="small" type="inner" title={t('bonusShop.buyDownload')} style={{ maxWidth: 400 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <span>{t('bonusShop.spendBonus')} </span>
          <InputNumber
            min={bonusPerGB}
            step={bonusPerGB}
            value={spent}
            onChange={(v) => setSpent(v || bonusPerGB)}
            style={{ width: 150 }}
          />
        </div>
        <div>
          {t('bonusShop.youReceive')} <strong>{formatSize(downloadBytes)}</strong> {t('bonusShop.downloadCredit')}
        </div>
        <Button
          type="primary"
          onClick={() => mutation.mutate(spent)}
          loading={mutation.isPending}
          disabled={(profile?.bonus ?? 0) < spent}
        >
          {t('bonusShop.buyNow')}
        </Button>
        {(profile?.bonus ?? 0) < spent && (
          <span style={{ color: '#ff4d4f' }}>{t('bonusShop.insufficientBonus')}</span>
        )}
      </Space>
    </Card>
  )
}

export default function BonusShop() {
  const { t } = useTranslation('user')

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const { data: seedRate } = useQuery({
    queryKey: ['seed-bonus-rate'],
    queryFn: () => getSeedBonusRate(),
    select: (res) => res.data,
  })

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('bonusShop.yourBonus')}
              value={profile?.bonus ?? 0}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('bonusShop.bonusPerHour')}
              value={seedRate?.bonus_per_hour ?? 0}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('bonusShop.seedingCount')}
              value={seedRate?.torrent_count ?? 0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('bonusShop.seedingSize')}
              value={seedRate?.total_size ? formatSize(seedRate.total_size) : '0 B'}
            />
          </Card>
        </Col>
      </Row>

      <Card title={t('bonusShop.exchangeRate')}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Descriptions column={1} bordered size="small" style={{ maxWidth: 400 }}>
            <Descriptions.Item label={t('bonusShop.rateLabel')}>
              {t('bonusShop.rateText', { rate: bonusPerGB })}
            </Descriptions.Item>
          </Descriptions>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <UploadExchange />
            </Col>
            <Col xs={24} md={12}>
              <DownloadExchange />
            </Col>
          </Row>
        </Space>
      </Card>
    </div>
  )
}
