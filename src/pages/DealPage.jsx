import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ExternalLink, Gamepad2, Monitor, Star } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDealDetails, getStores, storeRedirectUrl } from '../api/cheapshark'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { formatDate, formatPrice } from '../utils/format'

export function DealPage() {
  const { dealId } = useParams()
  const [imageFailed, setImageFailed] = useState(false)
  const detailsQuery = useQuery({ queryKey: ['deal', dealId], queryFn: () => getDealDetails(dealId), enabled: Boolean(dealId) })
  const storesQuery = useQuery({ queryKey: ['stores'], queryFn: getStores })

  if (detailsQuery.isPending || storesQuery.isPending) return <LoadingState label="Загружаем информацию о сделке..." />
  if (detailsQuery.isError || storesQuery.isError) return <ErrorState onRetry={() => { detailsQuery.refetch(); storesQuery.refetch() }} />

  const { gameInfo, cheaperStores = [], cheapestPrice } = detailsQuery.data
  const storeNames = new Map(storesQuery.data.map((store) => [store.storeID, store.storeName]))
  const storeName = storeNames.get(gameInfo.storeID) ?? `Магазин ${gameInfo.storeID}`

  return (
    <>
      <Link className="back-link" to="/"><ArrowLeft size={17} /> К результатам</Link>
      <article className="deal-detail">
        <div className="detail-cover">
          {imageFailed || !gameInfo.thumb ? <div className="cover-fallback"><Gamepad2 size={48} /><span>Нет обложки</span></div> : <img src={gameInfo.thumb} alt={`Обложка игры ${gameInfo.name}`} onError={() => setImageFailed(true)} />}
        </div>
        <div className="detail-content">
          <div className="card-labels"><span className="store-name">{storeName}</span><span className="platform-badge"><Monitor size={13} /> PC</span></div>
          <h1>{gameInfo.name}</h1>
          <div className="detail-price"><strong>{formatPrice(gameInfo.salePrice)}</strong><del>{formatPrice(gameInfo.retailPrice)}</del></div>
          <dl className="detail-list">
            <div><dt>Платформа</dt><dd>PC</dd></div>
            <div><dt>Магазин</dt><dd>{storeName}</dd></div>
            <div><dt>Metacritic</dt><dd>{gameInfo.metacriticScore || '—'}</dd></div>
            <div><dt>Steam</dt><dd><Star size={14} /> {gameInfo.steamRatingPercent ? `${gameInfo.steamRatingPercent}%` : '—'}</dd></div>
            <div><dt>Отзывы Steam</dt><dd>{gameInfo.steamRatingCount || '—'}</dd></div>
            <div><dt>Дата выхода</dt><dd>{formatDate(gameInfo.releaseDate)}</dd></div>
            {gameInfo.publisher && gameInfo.publisher !== 'N/A' && <div><dt>Издатель</dt><dd>{gameInfo.publisher}</dd></div>}
            <div><dt>Активация Steam</dt><dd>{gameInfo.steamworks === '1' ? 'Да' : 'Нет'}</dd></div>
            <div><dt>Исторический минимум</dt><dd>{cheapestPrice?.price ? formatPrice(cheapestPrice.price) : 'Нет данных'}</dd></div>
          </dl>
          <a className="button button-primary detail-action" href={storeRedirectUrl(dealId)} target="_blank" rel="noreferrer">Открыть в магазине <ExternalLink size={17} /></a>
        </div>
      </article>
      {cheaperStores.length > 0 && <section className="alternative-deals"><p className="eyebrow">Альтернативы</p><h2>Предложения дешевле</h2><div>{cheaperStores.map((deal) => <span key={deal.dealID}>{storeNames.get(deal.storeID) ?? `Магазин ${deal.storeID}`}: <strong>{formatPrice(deal.salePrice)}</strong></span>)}</div></section>}
    </>
  )
}
