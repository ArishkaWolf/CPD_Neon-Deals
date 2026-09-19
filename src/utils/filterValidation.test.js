import { describe, expect, it } from 'vitest'
import { validateFilters } from './filterValidation'

const validFilters = { lowerPrice: '', upperPrice: '', metacritic: '' }

describe('validateFilters', () => {
  it('принимает пустые и корректные значения', () => {
    expect(validateFilters(validFilters)).toEqual({})
    expect(validateFilters({ lowerPrice: '5', upperPrice: '20', metacritic: '80' })).toEqual({})
  })

  it('отклоняет отрицательные цены', () => {
    expect(validateFilters({ ...validFilters, lowerPrice: '-1' })).toHaveProperty('lowerPrice')
    expect(validateFilters({ ...validFilters, upperPrice: '-2' })).toHaveProperty('upperPrice')
  })

  it('отклоняет обратный диапазон цен', () => {
    expect(validateFilters({ ...validFilters, lowerPrice: '30', upperPrice: '10' })).toHaveProperty('upperPrice')
  })

  it('ограничивает рейтинг диапазоном от 0 до 100', () => {
    expect(validateFilters({ ...validFilters, metacritic: '-1' })).toHaveProperty('metacritic')
    expect(validateFilters({ ...validFilters, metacritic: '101' })).toHaveProperty('metacritic')
  })
})
