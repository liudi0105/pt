import { Form, Input, Button, Card, message, Typography, Tabs } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { register } from '../api/auth'
import { registerWithInvite } from '../api/invite'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

export function Register() {
  const [form] = Form.useForm()
  const [inviteForm] = Form.useForm()
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const { t } = useTranslation('auth')

  const handleSubmit = async (values: { username: string; email: string; password: string }) => {
    try {
      await register(values.username, values.email, values.password)
      message.success(t('registerSuccess'))
      navigate({ to: `/${lang}/login` })
    } catch {
      message.error(t('registerFailed'))
    }
  }

  const handleInviteSubmit = async (values: { username: string; email: string; password: string; invite: string }) => {
    try {
      await registerWithInvite(values.username, values.password, values.email, values.invite)
      message.success(t('registerSuccess'))
      navigate({ to: `/${lang}/login` })
    } catch (err: any) {
      message.error(err.response?.data?.error || t('registerFailed'))
    }
  }

  const tabItems = [
    {
      key: 'open',
      label: t('openRegistration'),
      children: (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: t('enterUsername') }]}>
            <Input prefix={<UserOutlined />} placeholder={t('username')} size="large" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: t('enterEmail') }, { type: 'email', message: t('invalidEmail') }]}>
            <Input prefix={<MailOutlined />} placeholder={t('email')} size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: t('enterPassword') }, { min: 6, message: t('passwordMinLength') }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('password')} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">{t('register')}</Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'invite',
      label: t('inviteCode'),
      children: (
        <Form form={inviteForm} onFinish={handleInviteSubmit} layout="vertical">
          <Form.Item name="invite" rules={[{ required: true, message: t('enterInviteCode') }]}>
            <Input prefix={<KeyOutlined />} placeholder={t('inviteCode')} size="large" />
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true, message: t('enterUsername') }]}>
            <Input prefix={<UserOutlined />} placeholder={t('username')} size="large" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: t('enterEmail') }, { type: 'email', message: t('invalidEmail') }]}>
            <Input prefix={<MailOutlined />} placeholder={t('email')} size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: t('enterPassword') }, { min: 6, message: t('passwordMinLength') }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('password')} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">{t('registerWithInvite')}</Button>
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center' }}>{t('register')}</Title>
        <Tabs items={tabItems} />
        <div style={{ textAlign: 'center' }}>
          {t('hasAccount')} <Link to={`/${lang}/login`}>{t('login')}</Link>
        </div>
      </Card>
    </div>
  )
}
