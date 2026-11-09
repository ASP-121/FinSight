import { request, USE_MOCK } from '../utils/apiClient'
import { mockAlerts } from '../data/mockAlerts'

const STORAGE_KEY = 'finsight_alerts'

function getStoredAlerts() {
  const cached = localStorage.getItem(STORAGE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      // ignore
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
  const updated = list.map((a) => (a.id === id ? { ...a, read: true } : a))
  saveStoredAlerts(updated)
  return updated
}

export async function markAllAlertsAsRead() {
  const list = getStoredAlerts()
  const updated = list.map((a) => ({ ...a, read: true }))
  saveStoredAlerts(updated)
  return updated
}

export async function dismissAlert(id) {
  const list = getStoredAlerts()
  const updated = list.filter((a) => a.id !== id)
  saveStoredAlerts(updated)
  return updated
}
