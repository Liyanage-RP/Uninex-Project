import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/dashboard', fallbackPath: '/', color: '#00c2cb', icon: '' },
    { name: 'Marketplace', path: '/marketplace', color: '#7c3aed', icon: '' },
    { name: 'Resources', path: '/resources', color: '#0ea5e9', icon: '' },
    { name: 'My Bookmarks', path: '/resources/bookmarks', color: '#ec4899', icon: '' },
    { name: 'Communities', path: '/communities', color: '#10b981', icon: '' },
    { name: 'Profile', path: '/profile', color: '#f59e0b', icon: '' },
    { name: 'Settings', path: '/settings', color: '#6b7280', icon: '️' },
  ];

  const collapsed = !isOpen;

  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'UN';

  return (
    <aside 
      className="relative flex flex-col h-[100vh] shrink-0 overflow-x-hidden"
      style={{
        width: collapsed ? '72px' : '260px',
        transition: 'width 0.3s ease',
        background: 'rgba(10,10,26,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        zIndex: 10
      }}
    >
      {/* NAV SECTION */}
      <nav style={{ padding: '8px', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || location.pathname === link.fallbackPath;

          return (
            <Link
              key={link.name}
              to={link.path}
              className="group relative flex items-center transition-all duration-200"
              style={{
                gap: '12px',
                padding: '12px',
                borderRadius: isActive ? '0 12px 12px 0' : '12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                background: isActive ? 'rgba(0,194,203,0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid #00c2cb' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div 
                className="w-[32px] h-[32px] shrink-0 rounded-[8px] flex items-center justify-center text-[16px] transition-colors"
                style={{
                  background: isActive ? link.color : 'rgba(255,255,255,0.06)'
                }}
              >
                {link.icon}
              </div>

              <span 
                className="font-medium text-sm transition-opacity duration-200"
                style={{
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : 'auto',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              >
                {link.name}
              </span>

              {/* TOOLTIP (when collapsed) */}
              {collapsed && (
                <div 
                  className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    left: 'calc(100% + 12px)',
                    background: 'rgba(10,10,26,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    zIndex: 20
                  }}
                >
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM SECTION */}
      <div 
        style={{
          marginTop: 'auto',
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
        className="flex flex-col gap-2"
      >
        {/* Student card (when expanded) */}
        {!collapsed && (
          <div 
            className="flex items-center gap-[12px] p-[12px] rounded-[12px] mb-[8px]"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div 
              className="w-[36px] h-[36px] rounded-full shrink-0 flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #00c2cb, #7c3aed)' }}
            >
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-sm font-medium truncate w-[160px]">{user?.name || 'Unknown'}</span>
              <span className="text-white/50 text-xs truncate">{user?.studentId || ''} · SLIIT</span>
            </div>
          </div>
        )}

        {/* Logout button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center transition-all duration-200"
          style={{
            padding: '10px',
            borderRadius: '10px',
            gap: '8px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: '#ef4444',
            background: 'transparent',
            border: '1px solid rgba(239,68,68,0.2)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span className="text-[16px] leading-none shrink-0" style={{ filter: 'grayscale(100%) brightness(200%) sepia(100%) hue-rotate(300deg) saturate(500%)' }}></span>
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;


