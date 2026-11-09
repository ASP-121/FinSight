/**
 * FinSight API Client
 * Configured with VITE_API_BASE_URL
 * Ready for future Spring Boot REST API integration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_SERVICES !== 'false'

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('finsight_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error = new Error(errorData.message || `API request failed with status ${response.status}`)
    error.status = response.status
    error.data = errorData
    throw error
  }
  
  if (response.status === 204) {
  return null
}
  return response.json()
}
