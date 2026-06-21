import { ColorPicker } from 'antd'
import { useTranslation } from 'react-i18next'

interface ColorPickerFieldProps {
  value?: string
  onChange?: (value: string) => void
}

export function ColorPickerField({ value, onChange }: ColorPickerFieldProps) {
  const { t } = useTranslation('admin')
  return (
    <ColorPicker
      value={value}
      aria-label={t('colorPicker.ariaLabel')}
      onChange={(color) => {
        onChange?.(color.toHexString())
      }}
      showText
    />
  )
}
