import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from '../api/axiosInstance'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // On app load: check localStorage for saved session
  useEffect(() => {
    const savedToken = localStorage.getItem('uninexus_token')
    const savedUser = localStorage.getItem('uninexus_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // LOGIN function
  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    try {
      const res = await axios.post('/auth/login', { email, password })
      const { token, user } = res.data.data
      
      setToken(token)
      setUser(user)
      localStorage.setItem('uninexus_token', token)
      localStorage.setItem('uninexus_user', JSON.stringify(user))
      
      setLoading(false)
      return { success: true, role: user.role }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      setError(msg)
      setLoading(false)
      return { success: false, message: msg }
    }
  }

  // REGISTER function
  const register = async (userData) => {
    setError(null)
    setLoading(true)
    try {
      const res = await axios.post('/auth/register', userData)
      const { token, user } = res.data.data
      
      setToken(token)
      setUser(user)
      localStorage.setItem('uninexus_token', token)
      localStorage.setItem('uninexus_user', JSON.stringify(user))
      
      setLoading(false)
      return { success: true, role: user.role }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg)
      setLoading(false)
      return { success: false, message: msg }
    }
  }

  // LOGOUT function
  const logout = () => {
    setUser(null)
    setToken(null)
    setError(null)
    localStorage.removeItem('uninexus_token')
    localStorage.removeItem('uninexus_user')
  }

  // CHECK if user is admin
  const isAdmin = () => user?.role === 'admin'
  
  // CHECK if user is student
  const isStudent = () => user?.role === 'student'

  return (
    <AuthContext.Provider value={{
      user, token, loading, error,
      login, register, logout,
      isAdmin, isStudent
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook
export const useAuth = () => useContext(AuthContext)
