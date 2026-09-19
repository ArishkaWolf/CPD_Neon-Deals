export const formatPrice = (value) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD' }).format(Number(value));
export const formatPercent = (value) => `${Math.round(Number(value))}%`;
export const formatDate = (timestamp) => {
    if (!timestamp)
        return 'Дата неизвестна';
    return new Intl.DateTimeFormat('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(timestamp * 1000));
};
