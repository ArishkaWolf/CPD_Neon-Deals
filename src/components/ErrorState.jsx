import { AlertTriangle, RefreshCw } from 'lucide-react';
export function ErrorState({ onRetry }) {
    return (<div className="status-state status-error" role="alert">
      <AlertTriangle size={28}/>
      <strong>Не удалось получить данные</strong>
      <p>Проверьте подключение к интернету или повторите запрос немного позже.</p>
      <button className="button button-secondary" type="button" onClick={onRetry}>
        <RefreshCw size={17}/> Повторить
      </button>
    </div>);
}
