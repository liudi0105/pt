import { Card, Typography, Space } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

export function Home() {
  const { t } = useTranslation('common')

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Card>
        <Title level={2}>{t('brand')}</Title>
        <Paragraph>{t('home.welcome')}</Paragraph>
      </Card>
      <Card title={t('home.quickLinks')}>
        <Paragraph>
          <ul>
            <li><a href="./torrents">{t('nav.torrents')}</a> — {t('home.browseTorrents')}</li>
            <li><a href="./offers">{t('nav.candidates')}</a> — {t('home.browseOffers')}</li>
          </ul>
        </Paragraph>
      </Card>
    </Space>
  )
}
