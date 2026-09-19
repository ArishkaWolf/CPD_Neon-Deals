import { describe, expect, it } from 'vitest'
import { buildAnalytics } from './analytics'

const deals = [
  { storeID: '1', savings: '20', salePrice: '10', dealRating: '7' },
  { storeID: '1', savings: '60', salePrice: '20', dealRating: '9' },
  { storeID: '2', savings: '80', salePrice: '30', dealRating: '8' },
]
const stores = [{ storeID: '1', storeName: 'Store One' }, { storeID: '2', storeName: 'Store Two' }]

describe('buildAnalytics', () => {
  it('рассчитывает итоговые показатели и лучшую сделку', () => {
    const result = buildAnalytics(deals, stores)
    expect(result.averageSaving).toBeCloseTo(53.33, 1)
    expect(result.averagePrice).toBe(20)
    expect(result.maximumSaving).toBe(80)
    expect(result.bestDeal).toBe(deals[1])
  })

  it('группирует скидки и магазины', () => {
    const result = buildAnalytics(deals, stores)
    expect(result.savingsBuckets).toEqual([1, 0, 1, 1])
    expect(result.topStores[0]).toEqual(['Store One', 2])
  })

  it('обрабатывает пустой набор', () => {
    const result = buildAnalytics([], stores)
    expect(result.averageSaving).toBe(0)
    expect(result.bestDeal).toBeUndefined()
  })
})
