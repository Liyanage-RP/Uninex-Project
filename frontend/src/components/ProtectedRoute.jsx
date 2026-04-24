import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center z-50 fade-up"
        style={{ background: '#080d14' }}
      >
        <h1 
          className="text-[32px] font-black tracking-tight mb-8"
          style={{
            background: 'linear-gradient(90deg, #00c2cb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          UNINEXUS
        </h1>
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 border-4 border-[#00c2cb]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#00c2cb] border-t-transparent rounded-full spin-ring"></div>
        </div>
        <p className="text-white/50 text-sm font-medium tracking-wide">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
