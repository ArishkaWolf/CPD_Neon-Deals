const API_BASE_URL = 'https://www.cheapshark.com/api/1.0'

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE_URL}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === false) return
    url.searchParams.set(key, typeof value === 'boolean' ? '1' : String(value))
  })
  return url
}

async function fetchResponse(path, params) {
  const response = await fetch(buildUrl(path, params))
  if (!response.ok) throw new Error(`CheapShark API вернул ошибку ${response.status}`)
  return response
}

export async function getDeals(params = {}) {
  const response = await fetchResponse('/deals', params)
  const deals = await response.json()
  const totalPagesHeader = response.headers.get('x-total-page-count')

  return {
    deals,
    totalPages: totalPagesHeader ? Number(totalPagesHeader) : null,
  }
}

export async function getStores() {
  const response = await fetchResponse('/stores')
  return response.json()
}

export async function getDealDetails(dealId) {
  const response = await fetchResponse('/deals', { id: decodeURIComponent(dealId) })
  const details = await response.json()
  if (!details?.gameInfo) throw new Error('Информация о сделке не найдена')
  return details
}

export const storeRedirectUrl = (dealId) =>
  `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(dealId)}`
