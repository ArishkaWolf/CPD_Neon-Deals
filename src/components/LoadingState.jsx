export function LoadingState({ label = 'Загружаем предложения...' }) {
    return (<div className="status-state" role="status">
      <span className="spinner" aria-hidden="true"/>
      <p>{label}</p>
    </div>);
}
