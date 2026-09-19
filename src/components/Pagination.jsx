import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ page, totalPages, onChange }) {
  const hasNext = totalPages === null ? true : page + 1 < totalPages
  return (
    <nav className="pagination" aria-label="Пагинация результатов">
      <button className="button button-secondary" type="button" disabled={page === 0} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={18} /> Назад
      </button>
      <span>Страница {page + 1}{totalPages !== null ? ` из ${totalPages}` : ''}</span>
      <button className="button button-secondary" type="button" disabled={!hasNext} onClick={() => onChange(page + 1)}>
        Далее <ChevronRight size={18} />
      </button>
    </nav>
  )
}
