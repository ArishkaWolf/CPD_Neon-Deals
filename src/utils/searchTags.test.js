import { describe, expect, it } from 'vitest'
import { getTagFilters, parseTags } from './searchTags'

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
})
