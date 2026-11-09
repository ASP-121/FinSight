import { request, USE_MOCK } from '../utils/apiClient'
import { mockGoals } from '../data/mockGoals'

const STORAGE_KEY = 'finsight_goals'

function getStoredGoals() {
  const cached = localStorage.getItem(STORAGE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      // ignore
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockGoals))
  return mockGoals
}

function saveStoredGoals(goals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
}

export async function getGoals() {
  if (!USE_MOCK) {
    return request('/api/goals')
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  return getStoredGoals()
}

export async function createGoal(data) {
  if (!USE_MOCK) {
    return request('/api/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 250))
  const list = getStoredGoals()
  const newGoal = {
    ...data,
    id: `goal_${Date.now()}`,
    targetAmount: Number(data.targetAmount),
    currentAmount: Number(data.currentAmount || 0),
    monthlyContribution: Number(data.monthlyContribution || 1000),
    color: data.color || '#6366f1',
    icon: data.icon || 'Target',
  }

  const updated = [...list, newGoal]
  saveStoredGoals(updated)
  return newGoal
}

export async function updateGoal(id, data) {
  if (!USE_MOCK) {
    return request(`/api/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  const list = getStoredGoals()
  const index = list.findIndex((g) => g.id === id)
  if (index === -1) throw new Error('Goal not found')

  const updated = {
    ...list[index],
    ...data,
    targetAmount: Number(data.targetAmount ?? list[index].targetAmount),
    currentAmount: Number(data.currentAmount ?? list[index].currentAmount),
  }
  list[index] = updated
  saveStoredGoals(list)
  return updated
}

export async function deleteGoal(id) {
  if (!USE_MOCK) {
    return request(`/api/goals/${id}`, {
      method: 'DELETE',
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  const list = getStoredGoals()
  const filtered = list.filter((g) => g.id !== id)
  saveStoredGoals(filtered)
  return { success: true, id }
}


export async function contributeToGoal(id, amount) {
  if (!USE_MOCK) {
    return request(`/api/goals/${id}/contribute`, {
      method: 'PATCH',
      body: JSON.stringify({
        amount: Number(amount),
      }),
    })
  }

  const list = getStoredGoals()
  const index = list.findIndex((g) => g.id === id)

  if (index === -1) {
    throw new Error('Goal not found')
  }

  const goal = list[index]

  const updatedAmount = Math.min(
    Number(goal.targetAmount),
    Number(goal.currentAmount) + Number(amount)
  )

  return updateGoal(id, {
    currentAmount: updatedAmount,
  })
}
