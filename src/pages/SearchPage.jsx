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
import { getTagFilters, parseTags } from '../utils/searchTags'

const PAGE_SIZE = 24

function filtersFromUrl(params) {
  const result = { ...defaultFilters }
  for (const key of Object.keys(defaultFilters)) {
    if (key === 'tags' && params.has(key)) result[key] = parseTags(params.get(key))
    else if (params.has(key)) result[key] = params.get(key) ?? ''
  }
  return result
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const appliedFilters = filtersFromUrl(searchParams)
  const tagFilters = getTagFilters(appliedFilters.tags)
  const page = Math.max(0, Number(searchParams.get('page') ?? 0))
  const selectedSort = searchParams.get('sortBy') ?? 'DealRating'
  const selectedDesc = searchParams.get('desc') !== '0'
  const sortBy = tagFilters.deepDiscount ? 'Savings' : selectedSort
  const desc = tagFilters.deepDiscount ? true : selectedDesc

  const storesQuery = useQuery({ queryKey: ['stores'], queryFn: getStores })
  const apiParams = {
    title: appliedFilters.title,
    storeID: appliedFilters.storeID,
    lowerPrice: appliedFilters.lowerPrice,
    upperPrice: appliedFilters.upperPrice,
    metacritic: tagFilters.metacritic ?? appliedFilters.metacritic,
    steamRating: tagFilters.steamRating,
    onSale: tagFilters.onSale,
    AAA: tagFilters.AAA,
    steamworks: tagFilters.steamworks,
    sortBy,
    desc,
    pageNumber: page,
    pageSize: PAGE_SIZE,
  }
  const dealsQuery = useQuery({ queryKey: ['deals', apiParams], queryFn: () => getDeals(apiParams) })
  const pageDeals = dealsQuery.data?.deals ?? []
  const visibleDeals = pageDeals.filter((deal) => !tagFilters.deepDiscount || Number(deal.savings) >= 50)
  const totalPages = tagFilters.deepDiscount && visibleDeals.length < PAGE_SIZE
    ? page + 1
    : (dealsQuery.data?.totalPages ?? null)

  const applyFilters = (values) => {
    const next = new URLSearchParams()
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length) next.set(key, value.join(','))
      else if (!Array.isArray(value) && value !== '') next.set(key, value)
    })
    const nextTagFilters = getTagFilters(values.tags)
    next.set('sortBy', nextTagFilters.deepDiscount ? 'Savings' : selectedSort)
    next.set('desc', nextTagFilters.deepDiscount ? '1' : (selectedDesc ? '1' : '0'))
    setSearchParams(next)
    setFiltersOpen(false)
  }

  const updateParams = (entries) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(entries).forEach(([key, value]) => next.set(key, value))
    setSearchParams(next)
  }

  const resetFilters = () => setSearchParams({ sortBy: 'DealRating', desc: '1' })

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
            <SortControls sortBy={sortBy} desc={desc} disabled={tagFilters.deepDiscount} onSortChange={(value) => updateParams({ sortBy: value, page: '0' })} onDirectionChange={() => updateParams({ desc: desc ? '0' : '1', page: '0' })} />
          </div>
          {tagFilters.deepDiscount && <p className="filter-notice">Тег «Скидка 50%+» автоматически упорядочивает предложения по размеру скидки и применяет порог 50%.</p>}
          {dealsQuery.isPending && <LoadingState />}
          {dealsQuery.isError && <ErrorState onRetry={() => dealsQuery.refetch()} />}
          {dealsQuery.data && <DealsGrid deals={visibleDeals} stores={storesQuery.data ?? []} />}
          {dealsQuery.data && pageDeals.length > 0 && <Pagination page={page} totalPages={totalPages} onChange={(nextPage) => updateParams({ page: String(nextPage) })} />}
        </section>
      </div>
    </>
  )
}
