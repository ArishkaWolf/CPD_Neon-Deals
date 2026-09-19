import { ArrowDown, ArrowUp } from 'lucide-react'

export function SortControls({ sortBy, desc, disabled = false, onSortChange, onDirectionChange }) {
  return (
    <div className="sort-controls">
      <label>
        <span className="sr-only">Сортировка</span>
        <select value={sortBy} disabled={disabled} onChange={(event) => onSortChange(event.target.value)}>
          <option value="DealRating">По рейтингу сделки</option>
          <option value="Price">По цене</option>
          <option value="Metacritic">По рейтингу</option>
          <option value="Release">По дате выхода</option>
          <option value="Savings">По размеру скидки</option>
        </select>
      </label>
      <button className="icon-button" type="button" disabled={disabled} onClick={onDirectionChange} title={desc ? 'По убыванию' : 'По возрастанию'}>
        {desc ? <ArrowDown size={19} /> : <ArrowUp size={19} />}
        <span className="sr-only">Изменить направление сортировки</span>
      </button>
    </div>
  )
}
