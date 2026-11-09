import { request, USE_MOCK } from '../utils/apiClient'
import { mockTransactions } from '../data/mockTransactions'

const STORAGE_KEY = 'finsight_transactions'

function getStoredTransactions() {
  const cached = localStorage.getItem(STORAGE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      // ignore
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTransactions))
  return mockTransactions
}

function saveStoredTransactions(txs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs))
}

function normalizeTransaction(tx) {
  return {
    ...tx,
    type: String(tx.type || '').toLowerCase(),
    notes: tx.notes || '',
  }
}

function toApiTransaction(data) {
  return {
    amount: Number(data.amount),
    description: data.description.trim(),
    type: String(data.type).toUpperCase(),
    category: data.category,
    date: data.date,
  }
}

function filterAndSortTransactions(transactions, filters = {}) {
  let list = transactions.map(normalizeTransaction)

  if (filters.search?.trim()) {
    const search = filters.search.trim().toLowerCase()
    list = list.filter((tx) =>
      [tx.description, tx.category, tx.notes]
        .some((value) => String(value || '').toLowerCase().includes(search))
    )
  }

  if (filters.category && filters.category !== 'All') {
    list = list.filter((tx) => tx.category === filters.category)
  }

  if (filters.type && filters.type !== 'All') {
    list = list.filter(
      (tx) => tx.type === filters.type.toLowerCase()
    )
  }

  if (filters.startDate) {
    list = list.filter((tx) => tx.date >= filters.startDate)
  }

  if (filters.endDate) {
    list = list.filter((tx) => tx.date <= filters.endDate)
  }

  switch (filters.sortBy) {
    case 'date-asc':
      list.sort((a, b) => a.date.localeCompare(b.date))
      break
    case 'amount-desc':
      list.sort((a, b) => Number(b.amount) - Number(a.amount))
      break
    case 'amount-asc':
      list.sort((a, b) => Number(a.amount) - Number(b.amount))
      break
    default:
      list.sort((a, b) => b.date.localeCompare(a.date))
  }

  return list
}

export async function getTransactions(filters = {}) {
  if (!USE_MOCK) {
    /*const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.category && filters.category !== 'All') params.append('category', filters.category)
    if (filters.type && filters.type !== 'All') params.append('type', filters.type.toLowerCase())
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    return request(`/api/transactions?${params.toString()}`) */
  const data = await request('/api/transactions')
  return filterAndSortTransactions(data, filters)
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  let list = getStoredTransactions()

  if (filters.search) {
    const q = filters.search.toLowerCase()
    list = list.filter(
      (tx) =>
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        (tx.notes && tx.notes.toLowerCase().includes(q))
    )
  }

  if (filters.category && filters.category !== 'All') {
    list = list.filter((tx) => tx.category.toLowerCase() === filters.category.toLowerCase())
  }

  if (filters.type && filters.type !== 'All') {
    list = list.filter((tx) => tx.type.toLowerCase() === filters.type.toLowerCase())
  }

  if (filters.startDate) {
    list = list.filter((tx) => new Date(tx.date) >= new Date(filters.startDate))
  }

  if (filters.endDate) {
    list = list.filter((tx) => new Date(tx.date) <= new Date(filters.endDate))
  }

  // Sorting
  if (filters.sortBy) {
    list = [...list].sort((a, b) => {
      if (filters.sortBy === 'amount-desc') return b.amount - a.amount
      if (filters.sortBy === 'amount-asc') return a.amount - b.amount
      if (filters.sortBy === 'date-asc') return new Date(a.date) - new Date(b.date)
      return new Date(b.date) - new Date(a.date) // default: date-desc
    })
  } else {
    list = [...list].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return list
}

export async function getTransactionById(id) {
  if (!USE_MOCK) {
      const data = await request(`/api/transactions/${id}`)
      return normalizeTransaction(data)
  }

  await new Promise((resolve) => setTimeout(resolve, 150))
  const list = getStoredTransactions()
  const found = list.find((t) => t.id === id)
  if (!found) throw new Error('Transaction not found')
  return found
}

export async function createTransaction(data) {
  if (!USE_MOCK) {
    const created = await request('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(toApiTransaction(data)),
  })
  return normalizeTransaction(created)
  }

  await new Promise((resolve) => setTimeout(resolve, 300))
  const list = getStoredTransactions()
  const newTx = {
    ...data,
    id: `tx_${Date.now()}`,
    amount: Number(data.amount),
    status: data.status || 'Completed',
    date: data.date || new Date().toISOString().split('T')[0]
  }

  const updated = [newTx, ...list]
  saveStoredTransactions(updated)
  return newTx
}

export async function updateTransaction(id, data) {
  if (!USE_MOCK) {
    const updated = await request(`/api/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toApiTransaction(data)),
  })
  return normalizeTransaction(updated)
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const list = getStoredTransactions()
  const index = list.findIndex((t) => t.id === id)
  if (index === -1) throw new Error('Transaction not found')

  const updatedTx = {
    ...list[index],
    ...data,
    amount: Number(data.amount ?? list[index].amount),
  }
  list[index] = updatedTx
  saveStoredTransactions(list)
  return updatedTx
}

export async function deleteTransaction(id) {
  if (!USE_MOCK) {
    return request(`/api/transactions/${id}`, {
      method: 'DELETE',
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  const list = getStoredTransactions()
  const filtered = list.filter((t) => t.id !== id)
  saveStoredTransactions(filtered)
  return { success: true, id }
}
