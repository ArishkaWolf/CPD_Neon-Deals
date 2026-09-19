import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { getDeals, getStores } from '../api/cheapshark'
import { DealsGrid } from '../components/DealsGrid'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { Pagination } from '../components/Pagination'
import { defaultFilters, SearchFilters } from '../components/SearchFilters'
import { SortControls } from '../components/SortControls'
import { useState } from 'react'

const PAGE_SIZE = 24
const booleanKeys = ['onSale', 'AAA', 'steamworks', 'highlyRated', 'deepDiscount']

function filtersFromUrl(params) {
  const result = { ...defaultFilters }
  for (const key of Object.keys(defaultFilters)) {
    if (booleanKeys.includes(key)) result[key] = params.get(key) === '1'
    else if (params.has(key)) result[key] = params.get(key) ?? ''
  }
  return result
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const appliedFilters = filtersFromUrl(searchParams)
  const page = Math.max(0, Number(searchParams.get('page') ?? 0))
  const selectedSort = searchParams.get('sortBy') ?? 'DealRating'
  const selectedDesc = searchParams.get('desc') !== '0'
  const sortBy = appliedFilters.deepDiscount ? 'Savings' : selectedSort
  const desc = appliedFilters.deepDiscount ? true : selectedDesc

  const storesQuery = useQuery({ queryKey: ['stores'], queryFn: getStores })
  const apiParams = {
    title: appliedFilters.title,
    storeID: appliedFilters.storeID,
    lowerPrice: appliedFilters.lowerPrice,
    upperPrice: appliedFilters.upperPrice,
    metacritic: appliedFilters.highlyRated ? '80' : appliedFilters.metacritic,
    steamRating: appliedFilters.highlyRated ? '80' : undefined,
    onSale: appliedFilters.onSale,
    AAA: appliedFilters.AAA,
    steamworks: appliedFilters.steamworks,
    sortBy,
    desc,
    pageNumber: page,
    pageSize: PAGE_SIZE,
  }
  const dealsQuery = useQuery({ queryKey: ['deals', apiParams], queryFn: () => getDeals(apiParams) })
  const pageDeals = dealsQuery.data?.deals ?? []
  const visibleDeals = pageDeals.filter((deal) => !appliedFilters.deepDiscount || Number(deal.savings) >= 50)
  const totalPages = appliedFilters.deepDiscount && visibleDeals.length < PAGE_SIZE
    ? page + 1
    : (dealsQuery.data?.totalPages ?? null)

  const applyFilters = (values) => {
    const next = new URLSearchParams()
    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === 'boolean' ? value : value !== '') next.set(key, typeof value === 'boolean' ? '1' : value)
    })
    next.set('sortBy', values.deepDiscount ? 'Savings' : selectedSort)
    next.set('desc', values.deepDiscount ? '1' : (selectedDesc ? '1' : '0'))
    setSearchParams(next)
    setFiltersOpen(false)
  }

  const updateParams = (entries) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(entries).forEach(([key, value]) => next.set(key, value))
    setSearchParams(next)
  }

  const resetFilters = () => setSearchParams({ onSale: '1', sortBy: 'DealRating', desc: '1' })

  return (
    <>
      <section className="page-intro">
        <div><p className="eyebrow">CheapShark API</p><h1>Игры дешевле. Выбор точнее.</h1><p>Сравнивайте предложения PC-магазинов в одном каталоге.</p></div>
        <button className="button button-secondary mobile-filter-button" type="button" onClick={() => setFiltersOpen((value) => !value)}>
          <SlidersHorizontal size={18} /> Фильтры
        </button>
      </section>
      <div className="search-layout">
        <aside className={filtersOpen ? 'filters-column is-open' : 'filters-column'}>
          <SearchFilters key={searchParams.toString()} initialValues={appliedFilters} stores={storesQuery.data ?? []} onSubmit={applyFilters} onReset={resetFilters} />
        </aside>
        <section className="results-column" aria-label="Результаты поиска">
          <div className="results-toolbar">
            <div><p className="eyebrow">Результаты</p><strong>{dealsQuery.data ? `${visibleDeals.length} предложений на странице` : 'Загрузка каталога'}</strong></div>
            <SortControls sortBy={sortBy} desc={desc} disabled={appliedFilters.deepDiscount} onSortChange={(value) => updateParams({ sortBy: value, page: '0' })} onDirectionChange={() => updateParams({ desc: desc ? '0' : '1', page: '0' })} />
          </div>
          {appliedFilters.deepDiscount && <p className="filter-notice">Для полного отбора скидок от 50% результаты автоматически упорядочены по размеру скидки.</p>}
          {dealsQuery.isPending && <LoadingState />}
          {dealsQuery.isError && <ErrorState onRetry={() => dealsQuery.refetch()} />}
          {dealsQuery.data && <DealsGrid deals={visibleDeals} stores={storesQuery.data ?? []} />}
          {dealsQuery.data && pageDeals.length > 0 && <Pagination page={page} totalPages={totalPages} onChange={(nextPage) => updateParams({ page: String(nextPage) })} />}
        </section>
      </div>
    </>
  )
}
