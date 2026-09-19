import { SearchX } from 'lucide-react';
import { DealCard } from './DealCard';
export function DealsGrid({ deals, stores }) {
    if (deals.length === 0) {
        return (<div className="status-state">
        <SearchX size={30}/>
        <strong>Ничего не найдено</strong>
        <p>Попробуйте изменить название, диапазон цены или быстрые фильтры.</p>
      </div>);
    }
    const storeNames = new Map(stores.map((store) => [store.storeID, store.storeName]));
    return (<div className="deals-grid">
      {deals.map((deal) => (<DealCard key={deal.dealID} deal={deal} storeName={storeNames.get(deal.storeID) ?? `Магазин ${deal.storeID}`}/>))}
    </div>);
}
