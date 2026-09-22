export const SEARCH_TAGS = [
  { id: 'discount', label: 'Со скидкой' },
  { id: 'aaa', label: 'AAA' },
  { id: 'steam', label: 'Steam' },
  { id: 'high-rating', label: 'Высокий рейтинг' },
  { id: 'deep-discount', label: 'Скидка 50%+' },
]

const validTagIds = new Set(SEARCH_TAGS.map(({ id }) => id))

export function parseTags(value = '') {
  const source = Array.isArray(value) ? value : value.split(',')
  return [...new Set(source.map((tag) => tag.trim()).filter((tag) => validTagIds.has(tag)))]
}

export function getTagFilters(value) {
  const tags = parseTags(value)
  const has = (tag) => tags.includes(tag)

  return {
    tags,
    onSale: has('discount') || has('deep-discount'),
    AAA: has('aaa'),
    steamworks: has('steam'),
    metacritic: has('high-rating') ? '80' : undefined,
    steamRating: has('high-rating') ? '80' : undefined,
    deepDiscount: has('deep-discount'),
  }
}
