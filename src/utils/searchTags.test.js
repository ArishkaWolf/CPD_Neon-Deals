import { describe, expect, it } from 'vitest'
import { getTagFilters, matchesTagFilters, parseTags } from './searchTags'

describe('search tags', () => {
  it('parses unique supported tags', () => {
    expect(parseTags('steam,aaa,steam,unknown')).toEqual(['steam', 'aaa'])
  })

  it('maps tags to CheapShark filters', () => {
    expect(getTagFilters(['discount', 'aaa', 'steam', 'high-rating'])).toMatchObject({
      onSale: true,
      AAA: true,
      steamworks: true,
      metacritic: '80',
      steamRating: '80',
      deepDiscount: false,
    })
  })

  it('makes the deep discount tag request sale results for local filtering', () => {
    expect(getTagFilters(['deep-discount'])).toMatchObject({ onSale: true, deepDiscount: true })
  })

  it('filters release years and combines selected year ranges with OR logic', () => {
    const filters = getTagFilters(['year-2010-2019', 'year-2024-plus'])

    expect(matchesTagFilters({ releaseDate: Date.UTC(2016, 0, 1) / 1000, savings: 0 }, filters)).toBe(true)
    expect(matchesTagFilters({ releaseDate: Date.UTC(2025, 0, 1) / 1000, savings: 0 }, filters)).toBe(true)
    expect(matchesTagFilters({ releaseDate: Date.UTC(2022, 0, 1) / 1000, savings: 0 }, filters)).toBe(false)
    expect(matchesTagFilters({ releaseDate: 0, savings: 0 }, filters)).toBe(false)
  })
})
