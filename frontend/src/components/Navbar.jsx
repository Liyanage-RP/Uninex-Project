import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onToggleSidebar }) {
  const location = useLocation();

  return (
    <nav className="navbar-container sticky top-0 z-30 flex items-center justify-between w-full h-[48px] px-2 shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2 h-full">
        {/* Hamburger Menu on Left Edge */}
        <button 
          onClick={onToggleSidebar}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ml-1 cursor-pointer"
        >
          <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Home Icon */}
        <Link to="/" className="hidden sm:flex w-[36px] h-[36px] items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors mr-2">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center h-full overflow-x-auto no-scrollbar">
          {[
            
            { name: 'Marketplace', path: '/marketplace', dropdown: false },
            { name: 'Resources', path: '/resources', dropdown: false },
            { name: 'Communities', path: '/communities', dropdown: false },
            { name: 'Profile', path: '/profile', dropdown: false },
            { name: 'About Us', path: '/about', dropdown: false }
          ].map(link => {
            const isActive = location.pathname.includes(link.path);
            return (
              <div key={link.name} className="relative h-full flex items-center shrink-0">
                <Link 
                  to={link.path}
                  className={`h-full flex items-center gap-1.5 px-3 md:px-4 text-[13px] font-medium whitespace-nowrap navbar-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                  {link.dropdown && (
                    <svg className="w-3 h-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 h-full pr-1 shrink-0">
        {/* Full Search Bar */}
        <div className="hidden lg:flex items-center relative w-[220px]">
           <svg className="w-3.5 h-3.5 text-white/50 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
           <input 
             type="text" 
             placeholder="Search all..." 
             className="navbar-search-input w-full h-[32px] rounded-full text-xs text-white placeholder-white/40 outline-none transition-colors border border-white/10 focus:border-[#00c2cb]"
           />
           <button className="w-5 h-5 absolute right-2 text-white/40 hover:text-white flex items-center justify-center text-[10px] font-bold">
             
           </button>
        </div>

        {/* Mobile Search Icon */}
        <button className="lg:hidden w-[32px] h-[32px] rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center border border-white/10 transition-colors">
          <svg className="w-4 h-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
