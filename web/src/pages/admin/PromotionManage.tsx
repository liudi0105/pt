import { useState } from 'react'
import { Card, Typography, Space, Select, Input, Button, message, Radio, Statistic } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { adminBatchUpdatePromotion } from '../../api/admin'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography

export function PromotionManage() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const [category, setCategory] = useState('')
  const [keyword, setKeyword] = useState('')
  const [promotion, setPromotion] = useState('free')
  const [result, setResult] = useState<number | null>(null)

  const batchMut = useMutation({
    mutationFn: () => adminBatchUpdatePromotion({ category: category || undefined, keyword: keyword || undefined, promotion }),
    onSuccess: (res) => {
      setResult(res.data.affected)
      message.success(t('promotionManage.applySuccess', { count: res.data.affected }))
    },
    onError: (err: any) => message.error(err.response?.data?.error || t('promotionManage.applyFailed')),
  })

  const promoOptions = [
    { value: 'none', label: tCommon('promotions.none') },
    { value: 'free', label: tCommon('promotions.free') },
    { value: 'twoup', label: tCommon('promotions.twoup') },
    { value: 'free_twoup', label: tCommon('promotions.freeTwoup') },
    { value: 'thirty_percent', label: tCommon('promotions.thirtyPercent') },
  ]

  return (
    <div>
      <Title level={4}><ThunderboltOutlined /> {t('promotionManage.title')}</Title>
      <Card style={{ maxWidth: 500 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>{t('promotionManage.filterCategory')}</Text>
            <Select
              placeholder={t('promotionManage.allCategories')}
              value={category || undefined}
              onChange={setCategory}
              allowClear
              style={{ width: '100%' }}
              options={[
                { value: 'movie', label: tCommon('categories.movie') },
                { value: 'tv', label: tCommon('categories.tv') },
                { value: 'music', label: tCommon('categories.music') },
                { value: 'software', label: tCommon('categories.software') },
                { value: 'game', label: tCommon('categories.game') },
                { value: 'documentary', label: tCommon('categories.documentary') },
                { value: 'anime', label: tCommon('categories.anime') },
                { value: 'ebook', label: tCommon('categories.ebook') },
              ]}
            />
          </div>

          <div>
            <Text strong>{t('promotionManage.filterKeyword')}</Text>
            <Input.Search
              placeholder={t('promotionManage.searchPlaceholder')}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              allowClear
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <Text strong>{t('promotionManage.promotionType')}</Text>
            <Radio.Group
              value={promotion}
              onChange={(e) => setPromotion(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {promoOptions.map(o => (
                  <Radio key={o.value} value={o.value}>{o.label}</Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>

          <Button type="primary" danger size="large" block
            onClick={() => batchMut.mutate()} loading={batchMut.isPending}>
            {t('promotionManage.apply')}
          </Button>

          {result !== null && (
            <Card size="small">
              <Statistic title={t('promotionManage.affectedTorrents')} value={result} suffix={t('promotionManage.torrents')} />
            </Card>
          )}
        </Space>
      </Card>
    </div>
  )
}
