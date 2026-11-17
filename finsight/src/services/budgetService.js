import { request, USE_MOCK } from '../utils/apiClient'
import { mockBudgets } from '../data/mockBudgets'
import { notifyAlertsChanged } from '../utils/alertEvents'

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
  let created

  if (!USE_MOCK) {
    created = await request('/api/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } else {
    await new Promise((resolve) => setTimeout(resolve, 250))
    const list = getStoredBudgets()

    created = {
      ...data,
      id: `bgt_${Date.now()}`,
      allocated: Number(data.allocated || data.limit || 0),
      spent: Number(data.spent || 0),
      month: data.month || 'October 2026',
      color: data.color || '#3b82f6',
      icon: data.icon || 'Wallet',
    }

    saveStoredBudgets([...list, created])
  }

  notifyAlertsChanged()
  return created
}

export async function updateBudget(id, data) {
  let updated

  if (!USE_MOCK) {
    updated = await request(`/api/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  } else {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const list = getStoredBudgets()
    const index = list.findIndex((b) => b.id === id)

    if (index === -1) throw new Error('Budget not found')

    updated = {
      ...list[index],
      ...data,
      allocated: Number(
        data.allocated ?? data.limit ?? list[index].allocated
      ),
    }

    list[index] = updated
    saveStoredBudgets(list)
  }

  notifyAlertsChanged()
  return updated
}

export async function deleteBudget(id) {
  let result

  if (!USE_MOCK) {
    result = await request(`/api/budgets/${id}`, {
      method: 'DELETE',
    })
  } else {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const list = getStoredBudgets()
    const filtered = list.filter((b) => b.id !== id)

    saveStoredBudgets(filtered)
    result = { success: true, id }
  }

  notifyAlertsChanged()
  return result
}
