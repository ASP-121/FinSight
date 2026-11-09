import React, { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initUser() {
      try {
        const u = await authService.getCurrentUser()
        setUser(u)
      } catch (err) {
        console.error('Failed to load user', err)
      } finally {
        setLoading(false)
      }
    }
    initUser()
  }, [])

  const login = async (credentials) => {
    const loggedInUser = await authService.login(credentials)
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = async (data) => {
    const registeredUser = await authService.register(data)
    setUser(registeredUser)
    return registeredUser
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const updateProfile = async (updates) => {
    const updated = await authService.updateUserProfile(updates)
    setUser(updated)
    return updated
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
