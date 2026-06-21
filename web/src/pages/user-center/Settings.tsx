import { Card, Button, Form, Input, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { updatePassword } from '../../api/user'
import { useTranslation } from 'react-i18next'

export default function Settings() {
  const { t } = useTranslation('user')
  const [form] = Form.useForm()

  const mutation = useMutation({
    mutationFn: (values: { current_password: string; new_password: string }) =>
      updatePassword(values.current_password, values.new_password),
    onSuccess: () => {
      message.success(t('settings.passwordSuccess'))
      form.resetFields()
    },
    onError: (err: any) => {
      message.error(err.response?.data?.error || t('settings.passwordFailed'))
    },
  })

  return (
    <Card title={t('settings.changePassword')}>
      <Form form={form} labelCol={{ style: { width: 120 } }} onFinish={mutation.mutate} style={{ maxWidth: 400 }}>
        <Form.Item
          name="current_password"
          label={t('settings.currentPassword')}
          rules={[{ required: true, message: t('settings.enterCurrentPassword') }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="new_password"
          label={t('settings.newPassword')}
          rules={[
            { required: true, message: t('settings.enterNewPassword') },
            { min: 6, message: t('settings.passwordMinLength') },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {t('settings.updatePassword')}
        </Button>
      </Form>
    </Card>
  )
}
