import { useQuery } from '@tanstack/react-query'
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, PointElement, Tooltip } from 'chart.js'
import { Bar, Doughnut, Scatter } from 'react-chartjs-2'
import { useSearchParams } from 'react-router-dom'
import { getDeals, getStores } from '../api/cheapshark'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { AnimatedContent } from '../components/reactbits/AnimatedContent'
import { AnimatedNumber } from '../components/reactbits/AnimatedNumber'
import { buildAnalytics } from '../utils/analytics'
import { formatPercent, formatPrice } from '../utils/format'

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, PointElement, Tooltip)
const chartColors = ['#ff58bd', '#d94fdf', '#9b6cff', '#f782cf', '#b96ce8', '#765be0', '#e54da9', '#c08af2']

export function AnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const storeID = searchParams.get('storeID') ?? ''
  const storesQuery = useQuery({ queryKey: ['stores'], queryFn: getStores })
  const dealsQuery = useQuery({
    queryKey: ['analytics-deals', storeID],
    queryFn: () => getDeals({ storeID, onSale: true, pageSize: 60, sortBy: 'DealRating', desc: true }),
  })

  if (dealsQuery.isPending || storesQuery.isPending) return <LoadingState label="Собираем аналитику скидок..." />
  if (dealsQuery.isError || storesQuery.isError) return <ErrorState onRetry={() => { dealsQuery.refetch(); storesQuery.refetch() }} />

  const deals = dealsQuery.data.deals
  const analytics = buildAnalytics(deals, storesQuery.data)
  const commonOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 1000, easing: 'easeOutQuart' }, plugins: { legend: { labels: { color: '#8e9aaa' } } }, scales: { x: { ticks: { color: '#8e9aaa' }, grid: { color: 'rgba(128,128,128,.12)' } }, y: { ticks: { color: '#8e9aaa' }, grid: { color: 'rgba(128,128,128,.12)' } } } }

  return (
    <>
      <section className="page-intro analytics-intro">
        <div><p className="eyebrow">Срез рынка</p><h1>Аналитика текущих скидок</h1><p>Статистика построена по 60 предложениям с наивысшим рейтингом сделки.</p></div>
        <label className="analytics-store-filter"><span>Магазин</span><select value={storeID} onChange={(event) => setSearchParams(event.target.value ? { storeID: event.target.value } : {})}><option value="">Все магазины</option>{storesQuery.data.filter((store) => store.isActive === 1).map((store) => <option key={store.storeID} value={store.storeID}>{store.storeName}</option>)}</select></label>
      </section>
      <section className="summary-grid" aria-label="Основные показатели">
        <AnimatedContent><article><span>Предложений</span><strong><AnimatedNumber value={deals.length} /></strong></article></AnimatedContent>
        <AnimatedContent delay={.06}><article><span>Средняя скидка</span><strong><AnimatedNumber value={analytics.averageSaving} format={formatPercent} /></strong></article></AnimatedContent>
        <AnimatedContent delay={.12}><article><span>Средняя цена</span><strong><AnimatedNumber value={analytics.averagePrice} format={formatPrice} /></strong></article></AnimatedContent>
        <AnimatedContent delay={.18}><article><span>Максимальная скидка</span><strong><AnimatedNumber value={analytics.maximumSaving} format={formatPercent} /></strong></article></AnimatedContent>
      </section>
      {analytics.bestDeal && <p className="best-deal">Лучшая сделка по рейтингу: <strong>{analytics.bestDeal.title}</strong> за {formatPrice(analytics.bestDeal.salePrice)}</p>}
      <section className="charts-grid">
        <AnimatedContent><article className="chart-panel"><div><p className="eyebrow">Распределение</p><h2>Глубина скидок</h2></div><div className="chart-wrap"><Bar data={{ labels: ['0–25%', '25–50%', '50–75%', '75–100%'], datasets: [{ label: 'Количество игр', data: analytics.savingsBuckets, backgroundColor: chartColors }] }} options={commonOptions} /></div></article></AnimatedContent>
        <AnimatedContent delay={.08}><article className="chart-panel"><div><p className="eyebrow">Магазины</p><h2>Доля предложений</h2></div><div className="chart-wrap"><Doughnut data={{ labels: analytics.topStores.map(([name]) => name), datasets: [{ data: analytics.topStores.map(([, count]) => count), backgroundColor: chartColors, borderWidth: 0 }] }} options={{ responsive: true, maintainAspectRatio: false, animation: commonOptions.animation, plugins: commonOptions.plugins }} /></div></article></AnimatedContent>
        <AnimatedContent className="chart-wide" delay={.12}><article className="chart-panel"><div><p className="eyebrow">Зависимость</p><h2>Цена и рейтинг сделки</h2></div><div className="chart-wrap"><Scatter data={{ datasets: [{ label: 'Предложения', data: deals.map((deal) => ({ x: Number(deal.salePrice), y: Number(deal.dealRating) })), backgroundColor: '#ff58bd' }] }} options={{ ...commonOptions, scales: { x: { ...commonOptions.scales.x, title: { display: true, text: 'Цена, $', color: '#8e9aaa' } }, y: { ...commonOptions.scales.y, title: { display: true, text: 'Рейтинг сделки', color: '#8e9aaa' } } } }} /></div></article></AnimatedContent>
      </section>
    </>
  )
}
