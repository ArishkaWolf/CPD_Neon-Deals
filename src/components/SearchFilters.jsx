import { useMemo, useState } from 'react'
import { RotateCcw, Search } from 'lucide-react'
import { validateFilters } from '../utils/filterValidation'

export const defaultFilters = {
  title: '',
  storeID: '',
  lowerPrice: '',
  upperPrice: '',
  metacritic: '',
  onSale: true,
  AAA: false,
  steamworks: false,
  highlyRated: false,
  deepDiscount: false,
}

export function SearchFilters({ initialValues, stores, onSubmit, onReset }) {
  const [values, setValues] = useState(initialValues)
  const errors = useMemo(() => validateFilters(values), [values])
  const isValid = Object.keys(errors).length === 0
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }))

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
        <button className="icon-button subtle" type="button" onClick={reset} title="Сбросить фильтры">
          <RotateCcw size={18} /><span className="sr-only">Сбросить фильтры</span>
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
      <fieldset className="quick-filters">
        <legend>Быстрые фильтры</legend>
        {[
          ['onSale', 'Только со скидкой'],
          ['AAA', 'AAA-игры'],
          ['steamworks', 'Активация Steam'],
          ['highlyRated', 'Высокий рейтинг'],
          ['deepDiscount', 'Скидка от 50%'],
        ].map(([key, label]) => (
          <label className="check-field" key={key}>
            <input type="checkbox" checked={Boolean(values[key])} onChange={(event) => update(key, event.target.checked)} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <button className="button button-primary filter-submit" type="submit" disabled={!isValid}>
        <Search size={18} /> Найти предложения
      </button>
    </form>
  )
}
