export function buildAnalytics(deals, stores) {
    const savingsBuckets = [0, 0, 0, 0];
    deals.forEach((deal) => {
        const saving = Number(deal.savings);
        savingsBuckets[Math.min(3, Math.floor(saving / 25))] += 1;
    });
    const storeNames = new Map(stores.map((store) => [store.storeID, store.storeName]));
    const storeCounts = new Map();
    deals.forEach((deal) => {
        const name = storeNames.get(deal.storeID) ?? `Магазин ${deal.storeID}`;
        storeCounts.set(name, (storeCounts.get(name) ?? 0) + 1);
    });
    const topStores = [...storeCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const sum = (field) => deals.reduce((total, deal) => total + Number(deal[field]), 0);
    return {
        savingsBuckets,
        topStores,
        averageSaving: deals.length ? sum('savings') / deals.length : 0,
        averagePrice: deals.length ? sum('salePrice') / deals.length : 0,
        maximumSaving: Math.max(0, ...deals.map((deal) => Number(deal.savings))),
        bestDeal: [...deals].sort((a, b) => Number(b.dealRating) - Number(a.dealRating))[0],
    };
}
