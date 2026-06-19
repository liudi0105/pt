import { Form, Input, Button, Card, message, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { login } from '../api/auth'
import { useAuthStore } from '../store/auth'
import { useTranslation } from 'react-i18next'

const { Title } = Typography

export function Login() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const { setAuth } = useAuthStore()
  const { t } = useTranslation('auth')

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const res = await login(values.username, values.password)
      const { token, user_id, username, role } = res.data
      setAuth(token, { id: user_id, username, role } as any)
      message.success(t('loginSuccess'))
      navigate({ to: '/$lang', params: { lang } })
    } catch {
      message.error(t('invalidCredentials'))
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center' }}>
          {t('login')}
        </Title>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: t('enterUsername') }]}>
            <Input prefix={<UserOutlined />} placeholder={t('username')} size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: t('enterPassword') }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('password')} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {t('login')}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          {t('noAccount')} <Link to="/$lang/register" params={{ lang }}>{t('register')}</Link>
        </div>
      </Card>
    </div>
  )
}
