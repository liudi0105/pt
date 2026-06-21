import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listLuckyDrawPrizes, draw, listDrawRecords } from '../api/luckydraw'
import { getProfile } from '../api/user'

export function LuckyDraw() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang } = useParams({ from: '/$lang' })
  const queryClient = useQueryClient()
  const [drawing, setDrawing] = useState(false)
  const [lastResult, setLastResult] = useState<{ prize: string; won: boolean } | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: prizes = [], isLoading: prizesLoading } = useQuery({
    queryKey: ['lucky-draw-prizes'],
    queryFn: () => listLuckyDrawPrizes(),
    select: (res) => res.data.prizes,
    staleTime: 5 * 60 * 1000,
  })

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    select: (res) => res.data,
  })

  const { data: recordsData, isLoading: recordsLoading } = useQuery({
    queryKey: ['lucky-draw-records', page],
    queryFn: () => listDrawRecords({ page, page_size: pageSize }),
    select: (res) => res.data,
  })

  const records = recordsData?.records ?? []
  const total = recordsData?.total ?? 0
  const loading = prizesLoading || profileLoading || recordsLoading

  const handleDraw = async () => {
    if (!profile || profile.bonus < (prizes[0]?.price || 0)) return
    setDrawing(true)
    try {
      const res = await draw()
      setLastResult({ prize: res.data.prize, won: res.data.won })
      setPage(1)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['lucky-draw-records'] })
    } finally {
      setDrawing(false)
    }
  }

  const cost = prizes.length > 0 ? prizes[0].price : 0

  if (loading) return <div className="container mx-auto p-4 text-center py-8">{t('common:loading')}</div>

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">{t('luckyDraw.title')}</h1>
      {profile && (
        <div className="mb-4 text-sm text-gray-500">
          {t('shop.myBonus')}: <span className="font-semibold text-yellow-600">{profile.bonus}</span> &middot;
          {t('luckyDraw.costPerDraw')}: {cost}
        </div>
      )}

      <div className="text-center mb-6">
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-lg font-semibold disabled:opacity-50"
          disabled={drawing || (profile ? profile.bonus < cost : true)}
          onClick={handleDraw}>
          {drawing ? t('common:loading') : t('luckyDraw.draw')}
        </button>
        {lastResult && (
          <div className={`mt-3 text-lg font-bold ${lastResult.won ? 'text-green-600' : 'text-gray-500'}`}>
            {lastResult.won ? t('luckyDraw.won', { prize: lastResult.prize }) : t('luckyDraw.none')}
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-2">{t('luckyDraw.availablePrizes')}</h2>
      {prizes.length === 0 ? (
        <div className="text-center py-4 text-gray-500">{t('luckyDraw.noPrizes')}</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {prizes.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded shadow p-3">
              <div className="font-medium">{p.name}</div>
              {p.description && <div className="text-sm text-gray-500">{p.description}</div>}
              <div className="text-xs text-gray-400 mt-1">
                {t('luckyDraw.probability')}: {p.probability}% &middot;
                {t('shop.stock')}: {p.stock < 0 ? t('luckyDraw.unlimited') : p.stock}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2">{t('luckyDraw.myRecords')}</h2>
      {records.length === 0 ? (
        <div className="text-center py-4 text-gray-500">{t('luckyDraw.noRecords')}</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700 text-sm text-gray-500">
                <th className="px-4 py-2 text-left">{t('luckyDraw.prize')}</th>
                <th className="px-4 py-2 text-right">{t('luckyDraw.cost')}</th>
                <th className="px-4 py-2 text-right">{t('luckyDraw.date')}</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{r.prize_name}</td>
                  <td className="px-4 py-2 text-right">{r.cost}</td>
                  <td className="px-4 py-2 text-right text-sm text-gray-500">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {total > pageSize && (
        <div className="flex justify-center gap-2 mt-4">
          <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t('common:prev')}</button>
          <span className="px-3 py-1">{page} / {Math.ceil(total / pageSize)}</span>
          <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            disabled={page >= Math.ceil(total / pageSize)} onClick={() => setPage(p => p + 1)}>{t('common:next')}</button>
        </div>
      )}
      <div className="mt-4">
        <button className="text-blue-500 hover:underline text-sm"
          onClick={() => navigate({ to: '/$lang/user-center/bonus', params: { lang } })}>
          &larr; {t('shop.backToBonus')}
        </button>
      </div>
    </div>
  )
}
