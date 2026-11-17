
import { request, USE_MOCK } from '../utils/apiClient'
import { mockAlerts } from '../data/mockAlerts'

const STORAGE_KEY = 'finsight_alerts'

function getStoredAlerts() {
  const cached = localStorage.getItem(STORAGE_KEY)

  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      // Ignore invalid cached data
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAlerts))
  return mockAlerts
}

function saveStoredAlerts(alerts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
}

export async function getAlerts() {
  if (!USE_MOCK) {
    return request('/api/alerts')
  }

  await new Promise((resolve) => setTimeout(resolve, 200))
  return getStoredAlerts()
}

export async function markAlertAsRead(id) {
  if (!USE_MOCK) {
    return request(`/api/alerts/${id}/read`, { method: 'PUT' })
  }

  const list = getStoredAlerts()
  const updated = list.map((alert) =>
    alert.id === id ? { ...alert, read: true } : alert
  )

  saveStoredAlerts(updated)
}

export async function markAllAlertsAsRead() {
  if (!USE_MOCK) {
    return request('/api/alerts/read-all', { method: 'PUT' })
  }

  const list = getStoredAlerts()
  const updated = list.map((alert) => ({ ...alert, read: true }))

  saveStoredAlerts(updated)
}

export async function dismissAlert(id) {
  if (!USE_MOCK) {
    return request(`/api/alerts/${id}`, { method: 'DELETE' })
  }

  const list = getStoredAlerts()
  const updated = list.filter((alert) => alert.id !== id)

  saveStoredAlerts(updated)
}
