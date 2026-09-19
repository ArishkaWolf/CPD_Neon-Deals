import { afterEach, describe, expect, it, vi } from 'vitest'
import { getDealDetails, getDeals } from './cheapshark'

afterEach(() => vi.restoreAllMocks())

describe('CheapShark API client', () => {
  it('читает количество страниц из заголовка ответа', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([{ title: 'Game' }]), { headers: { 'x-total-page-count': '12' } })))
    await expect(getDeals({ pageSize: 24 })).resolves.toEqual({ deals: [{ title: 'Game' }], totalPages: 12 })
  })

  it('не кодирует dealID дважды при запросе деталей', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ gameInfo: { name: 'Game' } })))
    vi.stubGlobal('fetch', fetchMock)
    await getDealDetails('abc%2Bdef%3D')
    expect(fetchMock.mock.calls[0][0].searchParams.get('id')).toBe('abc+def=')
  })
})
