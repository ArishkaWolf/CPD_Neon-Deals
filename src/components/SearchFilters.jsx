import { useMemo, useState } from 'react'
import { Check, RotateCcw, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { validateFilters } from '../utils/filterValidation'
import { SEARCH_TAGS } from '../utils/searchTags'

export const defaultFilters = {
  title: '',
  storeID: '',
  lowerPrice: '',
  upperPrice: '',
  metacritic: '',
  tags: [],
}

export function SearchFilters({ initialValues, stores, onSubmit, onReset }) {
  const [values, setValues] = useState(initialValues)
  const errors = useMemo(() => validateFilters(values), [values])
  const isValid = Object.keys(errors).length === 0
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }))
  const toggleTag = (tag) => update('tags', values.tags.includes(tag)
    ? values.tags.filter((item) => item !== tag)
    : [...values.tags, tag])

  const submit = (event) => {
    event.preventDefault()
    if (isValid) onSubmit(values)
  }

  const reset = () => {
    setValues(defaultFilters)
    onReset()
  }

  return (
    <form className="filter-panel" onSubmit={submit} noValidate>
      <div className="filter-heading">
        <div><p className="eyebrow">Параметры</p><h2>Фильтры поиска</h2></div>
        <button className="icon-button subtle filter-reset" type="button" onClick={reset} aria-label="Сбросить фильтры" title="Сбросить фильтры">
          <RotateCcw size={18} />
        </button>
      </div>
      <label className="field field-wide">
        <span>Название игры</span>
        <input value={values.title} onChange={(event) => update('title', event.target.value)} placeholder="Например, Cyberpunk" />
      </label>
      <label className="field field-wide">
        <span>Магазин</span>
        <select value={values.storeID} onChange={(event) => update('storeID', event.target.value)}>
          <option value="">Все магазины</option>
          {stores.filter((store) => store.isActive === 1).map((store) => (
            <option key={store.storeID} value={store.storeID}>{store.storeName}</option>
          ))}
        </select>
      </label>
      <div className="field-row">
        <label className="field">
          <span>Цена от, $</span>
          <input className={errors.lowerPrice ? 'input-error' : ''} type="number" min="0" step="1" value={values.lowerPrice} onChange={(event) => update('lowerPrice', event.target.value)} aria-invalid={Boolean(errors.lowerPrice)} />
          {errors.lowerPrice && <small className="field-error">{errors.lowerPrice}</small>}
        </label>
        <label className="field">
          <span>Цена до, $</span>
          <input className={errors.upperPrice ? 'input-error' : ''} type="number" min="0" step="1" value={values.upperPrice} onChange={(event) => update('upperPrice', event.target.value)} aria-invalid={Boolean(errors.upperPrice)} />
          {errors.upperPrice && <small className="field-error">{errors.upperPrice}</small>}
        </label>
      </div>
      <label className="field field-wide">
        <span>Metacritic от</span>
        <input className={errors.metacritic ? 'input-error' : ''} type="number" min="0" max="100" value={values.metacritic} onChange={(event) => update('metacritic', event.target.value)} placeholder="0–100" aria-invalid={Boolean(errors.metacritic)} />
        {errors.metacritic && <small className="field-error">{errors.metacritic}</small>}
      </label>
      <fieldset className="search-tags">
        <legend>Теги</legend>
        <p>Можно выбрать несколько</p>
        <div className="tag-options">
          {SEARCH_TAGS.map(({ id, label }) => {
            const selected = values.tags.includes(id)
            return (
              <motion.button
                key={id}
                className={selected ? 'tag-option is-selected' : 'tag-option'}
                type="button"
                aria-pressed={selected}
                whileTap={{ scale: 0.94 }}
                onClick={() => toggleTag(id)}
              >
                {selected && <Check size={13} />} {label}
              </motion.button>
            )
          })}
        </div>
      </fieldset>
      <button className="button button-primary filter-submit" type="submit" disabled={!isValid}>
        <Search size={18} /> Найти предложения
      </button>
    </form>
  )
}
