
import { mockUser } from '../data/mockUser'
import { request, USE_MOCK } from '../utils/apiClient'

const AUTH_USER_KEY = 'finsight_auth_user'
const AUTH_TOKEN_KEY = 'finsight_token'

function saveAuthenticatedUser(res) {
  // Backend returns id, name, email, message and token directly.
  const user = {
    id: res.id,
    name: res.name,
    firstName: res.name?.split(' ')[0] || res.name,
    email: res.email,
  }

  if (res.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, res.token)
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  return user
}

export async function login({ email, password, rememberMe = true }) {
  if (!USE_MOCK) {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    return saveAuthenticatedUser(res)
  }

  await new Promise((resolve) => setTimeout(resolve, 350))

  if (!email || !password) {
    throw new Error('Please provide email and password')
  }

  const user = {
    ...mockUser,
    email,
  }

  localStorage.setItem(AUTH_TOKEN_KEY, 'mock_jwt_token_finsight_2026')
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  return user
}

export async function register({
  name,
  email,
  password,
  monthlyIncome,
  monthlySavingsTarget,
}) {
  if (!USE_MOCK) {
    // Current backend signup accepts name, email and password.
    const res = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })

    return saveAuthenticatedUser(res)
  }

  await new Promise((resolve) => setTimeout(resolve, 400))

  const user = {
    ...mockUser,
    id: `usr_${Date.now()}`,
    name,
    firstName: name.split(' ')[0] || name,
    email,
    monthlyIncome: Number(monthlyIncome) || 30000,
    monthlySavingsTarget: Number(monthlySavingsTarget) || 8600,
  }

  localStorage.setItem(AUTH_TOKEN_KEY, 'mock_jwt_token_finsight_2026')
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  return user
}

export async function getCurrentUser() {
  const cached = localStorage.getItem(AUTH_USER_KEY)

  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      // Fall back to the mock user.
    }
  }

  return USE_MOCK ? mockUser : null
}

export async function updateUserProfile(updates) {
  if (!USE_MOCK) {
    return request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  await new Promise((resolve) => setTimeout(resolve, 250))

  const current = await getCurrentUser()
  const updated = { ...current, ...updates }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated))
  return updated
}

export async function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  return true
}
