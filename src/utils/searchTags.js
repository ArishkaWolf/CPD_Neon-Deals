export const SEARCH_TAGS = [
  { id: 'discount', label: 'Со скидкой' },
  { id: 'aaa', label: 'AAA' },
  { id: 'steam', label: 'Steam' },
  { id: 'high-rating', label: 'Высокий рейтинг' },
  { id: 'deep-discount', label: 'Скидка 50%+' },
  { id: 'year-2024-plus', label: '2024+' },
  { id: 'year-2020-2023', label: '2020–2023' },
  { id: 'year-2010-2019', label: '2010–2019' },
  { id: 'year-before-2010', label: 'До 2010' },
]

const validTagIds = new Set(SEARCH_TAGS.map(({ id }) => id))

export function parseTags(value = '') {
  const source = Array.isArray(value) ? value : value.split(',')
  return [...new Set(source.map((tag) => tag.trim()).filter((tag) => validTagIds.has(tag)))]
}

export function getTagFilters(value) {
  const tags = parseTags(value)
  const has = (tag) => tags.includes(tag)
  const yearTags = tags.filter((tag) => tag.startsWith('year-'))

  return {
    tags,
    onSale: has('discount') || has('deep-discount'),
    AAA: has('aaa'),
    steamworks: has('steam'),
    metacritic: has('high-rating') ? '80' : undefined,
    steamRating: has('high-rating') ? '80' : undefined,
    deepDiscount: has('deep-discount'),
    yearTags,
  }
}

function matchesYear(year, tag) {
  if (tag === 'year-2024-plus') return year >= 2024
  if (tag === 'year-2020-2023') return year >= 2020 && year <= 2023
  if (tag === 'year-2010-2019') return year >= 2010 && year <= 2019
  return tag === 'year-before-2010' && year < 2010
}

export function matchesTagFilters(deal, filters) {
  if (filters.deepDiscount && Number(deal.savings) < 50) return false
  if (filters.yearTags.length === 0) return true
  if (!deal.releaseDate) return false

  const year = new Date(Number(deal.releaseDate) * 1000).getUTCFullYear()
  return filters.yearTags.some((tag) => matchesYear(year, tag))
}
