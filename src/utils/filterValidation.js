export function validateFilters(values) {
  const errors = {}
  const lowerPrice = values.lowerPrice === '' ? null : Number(values.lowerPrice)
  const upperPrice = values.upperPrice === '' ? null : Number(values.upperPrice)
  const metacritic = values.metacritic === '' ? null : Number(values.metacritic)

  if (lowerPrice !== null && lowerPrice < 0) errors.lowerPrice = 'Цена не может быть отрицательной'
  if (upperPrice !== null && upperPrice < 0) errors.upperPrice = 'Цена не может быть отрицательной'
  if (lowerPrice !== null && upperPrice !== null && lowerPrice > upperPrice) {
    errors.upperPrice = 'Максимальная цена должна быть не меньше минимальной'
  }
  if (metacritic !== null && (metacritic < 0 || metacritic > 100)) {
    errors.metacritic = 'Рейтинг должен быть от 0 до 100'
  }

  return errors
}
