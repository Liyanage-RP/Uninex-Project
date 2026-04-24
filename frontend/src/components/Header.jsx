import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'UN';
  const displayName = user ? `${user.studentId || ''} ${user.name || ''}`.trim() : '';

  return (
    <header className="header-container sticky top-0 z-40 w-full shrink-0 h-[75px] flex items-center justify-between px-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
      {/* LEFT: Branding */}
      <div className="flex items-center gap-4">
        <Link to="/" className="header-brand-text text-[26px] font-black tracking-tight">
          UNINEXUS
        </Link>
        <div className="h-[32px] w-[1px] bg-white/20"></div>
        <span className="header-subtitle-text text-[22px] font-bold text-white tracking-wide">
          Sliit university student's Digital platform 
        </span>
      </div>

      {/* RIGHT: Profile Area */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer transition-transform hover:scale-105">
          <svg className="w-6 h-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div className="absolute -top-1.5 -right-2 bg-[#ef4444] text-white text-[10px] font-bold px-1 min-w-[20px] h-[16px] rounded-full flex items-center justify-center border-2 border-[#161d2d]">
            228
          </div>
        </div>

        {/* User Name & Dropdown */}
        <div 
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="hidden md:inline text-[14px] font-semibold text-white/90 tracking-wide uppercase">
            {displayName}
          </span>
          <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Large Circular Avatar */}
        <div className="header-avatar w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0 shadow-lg">
          <span className="text-[18px] font-bold tracking-wider">{initials}</span>
        </div>

        {/* Profile Dropdown Menu */}
        {dropdownOpen && (
          <div className="header-dropdown absolute top-[65px] right-6 w-56 rounded-xl py-2 shadow-2xl z-50 border border-white/10">
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white" onClick={() => setDropdownOpen(false)}>
              <span className="text-lg"></span> My Profile
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white" onClick={() => setDropdownOpen(false)}>
              <span className="text-lg">️</span> Preferences
            </Link>
            <div className="h-px w-full bg-white/10 my-1"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#ef4444] hover:bg-red-500/10">
              <span className="text-lg"></span> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

