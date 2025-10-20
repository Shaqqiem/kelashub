import React, { createContext, useContext, useEffect, useState } from 'react'
import { post } from '../services/api'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('kh_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { token, user } = await post('/auth/login', { email, password })
      localStorage.setItem('kh_token', token)
      localStorage.setItem('kh_user', JSON.stringify(user))
      setUser(user)
      return true
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, name, password) => {
    setLoading(true)
    try {
      const { token, user } = await post('/auth/register', { email, name, password })
      localStorage.setItem('kh_token', token)
      localStorage.setItem('kh_user', JSON.stringify(user))
      setUser(user)
      return true
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('kh_token')
    localStorage.removeItem('kh_user')
    setUser(null)
  }

  return <AuthCtx.Provider value={{ user, login, register, logout, loading }}>
    {children}
  </AuthCtx.Provider>
}
