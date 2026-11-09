import { request, USE_MOCK } from '../utils/apiClient'
import { mockBudgets } from '../data/mockBudgets'

const STORAGE_KEY = 'finsight_budgets'

function getStoredBudgets() {
  const cached = localStorage.getItem(STORAGE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      // ignore
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBudgets))
  return mockBudgets
}

function saveStoredBudgets(budgets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets))
}

export async function getBudgets() {
  if (!USE_MOCK) {
    return request('/api/budgets')
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  return getStoredBudgets()
}

export async function createBudget(data) {
  if (!USE_MOCK) {
    return request('/api/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const list = getStoredBudgets()
  const newBudget = {
    ...data,
    id: `bgt_${Date.now()}`,
    allocated: Number(data.allocated || data.limit || 0),
    spent: Number(data.spent || 0),
    month: data.month || 'October 2026',
    color: data.color || '#3b82f6',
    icon: data.icon || 'Wallet'
  }

  const updated = [...list, newBudget]
  saveStoredBudgets(updated)
  return newBudget
}

export async function updateBudget(id, data) {
  if (!USE_MOCK) {
    return request(`/api/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  const list = getStoredBudgets()
  const index = list.findIndex((b) => b.id === id)
  if (index === -1) throw new Error('Budget not found')

  const updatedBudget = {
    ...list[index],
    ...data,
    allocated: Number(data.allocated ?? data.limit ?? list[index].allocated),
  }
  list[index] = updatedBudget
  saveStoredBudgets(list)
  return updatedBudget
}

export async function deleteBudget(id) {
  if (!USE_MOCK) {
    return request(`/api/budgets/${id}`, {
      method: 'DELETE',
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  const list = getStoredBudgets()
  const filtered = list.filter((b) => b.id !== id)
  saveStoredBudgets(filtered)
  return { success: true, id }
}
