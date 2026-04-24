import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="py-12 px-8 flex-shrink-0"
      style={{
        background: 'rgba(10, 10, 26, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* COL 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(90deg, #00c2cb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              UNINEXUS
            </div>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              Empowering university students through technology and community.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {[ '', '', '', '' ].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,194,203,0.5)';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(0,194,203,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span className="text-sm grayscale hover:grayscale-0">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* COL 2: Platform */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg mb-2"
              style={{
                background: 'linear-gradient(90deg, #00c2cb, #0ea5e9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Platform
            </h3>
            <ul className="space-y-3">
              {[ 'Marketplace', 'Resources', 'Communities', 'Sports', 'Profile', 'Settings' ].map(link => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-white/50 text-sm font-medium transition-all duration-300 hover:text-white hover:underline decoration-[#00c2cb] underline-offset-4">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: Support */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg mb-2"
              style={{
                background: 'linear-gradient(90deg, #7c3aed, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Support
            </h3>
            <ul className="space-y-3">
              {[ 'Help Center', 'Contact Us', 'Report Issue', 'Privacy Policy', 'Terms of Use' ].map(link => (
                <li key={link}>
                  <Link to="#" className="text-white/50 text-sm font-medium transition-all duration-300 hover:text-white hover:underline decoration-[#7c3aed] underline-offset-4">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4: University */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-lg mb-2"
              style={{
                background: 'linear-gradient(90deg, #10b981, #00c2cb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              University
            </h3>
            <ul className="space-y-3">
              {[ 'SLIIT Website', 'Faculty of Computing', 'Student Portal', 'IT Department', 'Academic Calendar' ].map(link => (
                <li key={link}>
                  <a href="#" className="text-white/50 text-sm font-medium transition-all duration-300 hover:text-white hover:underline decoration-[#10b981] underline-offset-4">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px mt-12 mb-6" style={{ background: 'rgba(255,255,255,0.06)' }}></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-white/40">
          <p>© 2026 UniNexus · SLIIT Faculty of Computing</p>
          <p>Crafted with  by Group Y3_S1_WE_IT_301_1.2</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
