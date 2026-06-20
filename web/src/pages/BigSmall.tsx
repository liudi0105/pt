import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { placeBet, listBets, type GameBet } from '../api/game'
import { getProfile } from '../api/user'

export function BigSmall() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<{ bonus: number } | null>(null)
  const [bets, setBets] = useState<GameBet[]>([])
  const [total, setTotal] = useState(0)
  const [betAmount, setBetAmount] = useState(10)
  const [betChoice, setBetChoice] = useState<string>('big')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState<{
    dice: number[]; total: number; result: string; payout: number
  } | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const load = () => {
    setLoading(true)
    Promise.all([
      getProfile().then(r => setProfile(r.data)),
      listBets({ page, page_size: pageSize }).then(r => {
        setBets(r.data.bets)
        setTotal(r.data.total)
      }),
    ]).finally(() => setLoading(false))
  }

  useState(() => load())

  const handleBet = async () => {
    if (!profile || profile.bonus < betAmount) return
    setSubmitting(true)
    try {
      const res = await placeBet({ bet_amount: betAmount, bet_choice: betChoice })
      setLastResult({
        dice: res.data.dice,
        total: res.data.total,
        result: res.data.result,
        payout: res.data.payout,
      })
      const profileRes = await getProfile()
      setProfile(profileRes.data)
      const r = await listBets({ page: 1, page_size: pageSize })
      setBets(r.data.bets)
      setTotal(r.data.total)
      setPage(1)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="container mx-auto p-4 text-center py-8">{t('common:loading')}</div>

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">{t('bigSmall.title')}</h1>
      {profile && (
        <div className="mb-4 text-sm text-gray-500">
          {t('shop.myBonus')}: <span className="font-semibold text-yellow-600">{profile.bonus}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded shadow p-6 mb-6 text-center">
        <div className="text-lg mb-4">{t('bigSmall.pick')}</div>
        <div className="flex justify-center gap-4 mb-4">
          <button className={`px-6 py-3 rounded-lg text-lg font-semibold ${betChoice === 'big' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setBetChoice('big')}>{t('bigSmall.big')} (11-18)</button>
          <button className={`px-6 py-3 rounded-lg text-lg font-semibold ${betChoice === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => setBetChoice('small')}>{t('bigSmall.small')} (3-10)</button>
        </div>
        <div className="flex justify-center items-center gap-2 mb-4">
          <span>{t('bigSmall.betAmount')}:</span>
          <input type="number" className="w-24 p-1 border rounded dark:bg-gray-700 dark:border-gray-600 text-center"
            value={betAmount} onChange={e => setBetAmount(Math.max(1, Number(e.target.value)))}
            min={1} />
        </div>
        <button className="px-6 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
          disabled={submitting || !profile || profile.bonus < betAmount}
          onClick={handleBet}>
          {submitting ? t('common:loading') : t('bigSmall.bet')}
        </button>

        {lastResult && (
          <div className="mt-4">
            <div className="text-3xl font-bold mb-2">
              {lastResult.dice.join(' - ')}
            </div>
            <div className="text-lg">
              {t('bigSmall.total')}: <span className="font-bold">{lastResult.total}</span>
            </div>
            <div className={`text-xl font-bold mt-1 ${lastResult.result === 'win' ? 'text-green-600' : 'text-red-500'}`}>
              {lastResult.result === 'win'
                ? t('bigSmall.win', { payout: lastResult.payout })
                : t('bigSmall.lose')}
            </div>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-2">{t('bigSmall.myBets')}</h2>
      {bets.length === 0 ? (
        <div className="text-center py-4 text-gray-500">{t('bigSmall.noBets')}</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700 text-sm text-gray-500">
                <th className="px-4 py-2 text-left">{t('bigSmall.choice')}</th>
                <th className="px-4 py-2 text-right">{t('bigSmall.betAmount')}</th>
                <th className="px-4 py-2 text-right">{t('bigSmall.diceResult')}</th>
                <th className="px-4 py-2 text-right">{t('bigSmall.result')}</th>
                <th className="px-4 py-2 text-right">{t('bigSmall.payout')}</th>
                <th className="px-4 py-2 text-right">{t('bigSmall.date')}</th>
              </tr>
            </thead>
            <tbody>
              {bets.map(b => (
                <tr key={b.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{b.bet_choice}</td>
                  <td className="px-4 py-2 text-right">{b.bet_amount}</td>
                  <td className="px-4 py-2 text-right">{b.dice_result}</td>
                  <td className={`px-4 py-2 text-right font-medium ${b.result === 'win' ? 'text-green-600' : 'text-red-500'}`}>
                    {b.result === 'win' ? t('bigSmall.winShort') : t('bigSmall.loseShort')}
                  </td>
                  <td className="px-4 py-2 text-right">{b.payout}</td>
                  <td className="px-4 py-2 text-right text-sm text-gray-500">{new Date(b.created_at).toLocaleString()}</td>
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
          onClick={() => navigate({ to: '/$lang/user-center/bonus', params: { lang: '' } })}>
          &larr; {t('shop.backToBonus')}
        </button>
      </div>
    </div>
  )
}
