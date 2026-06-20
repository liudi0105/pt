import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { listShopItems, buyShopItem, type ShopItem } from '../api/shop'
import { getProfile } from '../api/user'

export function Shop() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{ bonus: number } | null>(null)
  const [buyingId, setBuyingId] = useState(0)

  useState(() => {
    Promise.all([
      listShopItems().then(r => { setItems(r.data.items); setLoading(false) }),
      getProfile().then(r => setProfile(r.data)),
    ])
  })

  const handleBuy = async (item: ShopItem) => {
    if (profile && profile.bonus < item.price) return
    setBuyingId(item.id)
    try {
      await buyShopItem(item.id)
      const profileRes = await getProfile()
      setProfile(profileRes.data)
    } finally {
      setBuyingId(0)
    }
  }

  if (loading) return <div className="container mx-auto p-4 text-center py-8">{t('common:loading')}</div>

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">{t('shop.title')}</h1>
      {profile && (
        <div className="mb-4 text-sm text-gray-500">
          {t('shop.myBonus')}: <span className="font-semibold text-yellow-600">{profile.bonus}</span>
        </div>
      )}
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t('shop.noItems')}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col">
              <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
              {item.description && <p className="text-sm text-gray-500 mb-3 flex-1">{item.description}</p>}
              <div className="flex items-center justify-between mt-auto">
                <span className="text-yellow-600 font-bold">{item.price} {t('shop.bonusUnit')}</span>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
                  disabled={buyingId === item.id || (profile ? profile.bonus < item.price : true)}
                  onClick={() => handleBuy(item)}>
                  {buyingId === item.id ? t('common:loading') : t('shop.buy')}
                </button>
              </div>
              {item.stock > 0 && (
                <div className="text-xs text-gray-400 mt-1">{t('shop.stock')}: {item.stock}</div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="mt-4">
        <button className="text-blue-500 hover:underline text-sm"
          onClick={() => navigate({ to: '/$lang/user-center/bonus', params: { lang: '' } })}>
          &larr; {t('shop.backToBonus')}
        </button>
      </div>
    </div>
  )
}
