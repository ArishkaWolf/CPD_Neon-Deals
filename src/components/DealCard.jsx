import { useState } from 'react'
import { ExternalLink, Gamepad2, Monitor, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { storeRedirectUrl } from '../api/cheapshark'
import { formatDate, formatPercent, formatPrice } from '../utils/format'

export function DealCard({ deal, storeName }) {
  const [imageFailed, setImageFailed] = useState(!deal.thumb)

  return (
    <article className="deal-card">
      <div className="deal-cover-wrap">
        {imageFailed ? (
          <div className="cover-fallback" role="img" aria-label={`Обложка ${deal.title} недоступна`}>
            <Gamepad2 size={34} /><span>Нет обложки</span>
          </div>
        ) : (
          <img className="deal-cover" src={deal.thumb} alt={`Обложка игры ${deal.title}`} loading="lazy" onError={() => setImageFailed(true)} />
        )}
        {Number(deal.savings) > 0 && <span className="discount-badge">-{formatPercent(deal.savings)}</span>}
      </div>
      <div className="deal-body">
        <div>
          <div className="card-labels"><span className="store-name">{storeName}</span><span className="platform-badge"><Monitor size={13} /> PC</span></div>
          <h2>{deal.title}</h2>
        </div>
        <div className="price-row">
          <strong>{formatPrice(deal.salePrice)}</strong>
          {deal.salePrice !== deal.normalPrice && <del>{formatPrice(deal.normalPrice)}</del>}
        </div>
        <dl className="deal-meta">
          <div><dt>Metacritic</dt><dd>{deal.metacriticScore || '—'}</dd></div>
          <div><dt><Star size={14} /> Steam</dt><dd>{deal.steamRatingPercent ? `${deal.steamRatingPercent}%` : '—'}</dd></div>
          <div><dt>Релиз</dt><dd>{formatDate(deal.releaseDate)}</dd></div>
        </dl>
        <div className="card-actions">
          <Link className="button button-secondary" to={`/deal/${encodeURIComponent(deal.dealID)}`}>Подробнее</Link>
          <a className="button button-primary" href={storeRedirectUrl(deal.dealID)} target="_blank" rel="noreferrer">В магазин <ExternalLink size={16} /></a>
        </div>
      </div>
    </article>
  )
}
