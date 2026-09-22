import { LatticeLoader } from './reactbits/LatticeLoader'

export function LoadingState({ label = 'Загружаем предложения...' }) {
  return <div className="status-state"><LatticeLoader label={label} /></div>
}
