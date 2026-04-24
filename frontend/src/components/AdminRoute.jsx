import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  const navigate = useNavigate()

  // First pass through standard ProtectedRoute (handles loading & no-auth)
  if (loading || !user) {
    return <ProtectedRoute>{children}</ProtectedRoute>
  }

  // If logged in, but not an admin, show ACCESS DENIED
  if (!isAdmin()) {
    return (
      <div className="fixed inset-0 flex items-center justify-center fade-up z-50" style={{ background: '#080d14' }}>
        <div 
          className="relative max-w-[400px] w-[90%] flex flex-col items-center text-center shadow-[0_20px_60px_rgba(239,68,68,0.2)]"
          style={{
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '20px',
            padding: '48px 32px'
          }}
        >
          {/* Icon */}
          <div className="w-[72px] h-[72px] rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
            <span className="text-[36px]"></span>
          </div>

          <h2 className="text-[#ef4444] text-[32px] font-bold tracking-tight mb-2">Access Denied</h2>
          
          <p className="text-white/60 font-medium mb-6">
            This area is restricted to administrators only. You do not have the required permissions.
          </p>

          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold px-4 py-2 rounded-full mb-8 flex items-center gap-2">
            <span>️</span> This attempt has been logged
          </div>

          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full h-[48px] rounded-xl text-white font-bold transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(0,194,203,0.3)]"
              style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' }}
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-full h-[48px] rounded-xl text-white/80 font-semibold transition-colors hover:bg-white/5 hover:text-white"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
