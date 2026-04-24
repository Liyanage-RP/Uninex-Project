import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function AnimatedCounter({ end, duration = 2000, isFloat = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = progress * end;
      setCount(isFloat ? val : Math.floor(val));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isFloat]);

  return <span>{isFloat ? count.toFixed(1) : count}</span>;
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const glassBase = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '24px'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const sectionTitleStyle = {
    fontWeight: 'bold',
    color: 'white',
    fontSize: '18px'
  };

  const sectionLinkStyle = {
    color: '#00c2cb',
    fontSize: '14px',
    textDecoration: 'none'
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b35 40%, #0a1628 100%)',
      fontFamily: 'Inter, sans-serif',
      position: 'relative'
    }}>

      {/* Background blobs - BEHIND everything */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'rgba(0,194,203,0.07)',
        filter: 'blur(80px)', zIndex: 0,
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'fixed', top: '-10%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'rgba(124,58,237,0.07)',
        filter: 'blur(80px)', zIndex: 0,
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'fixed', bottom: '-20%', left: '40%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(14,165,233,0.06)',
        filter: 'blur(80px)', zIndex: 0,
        pointerEvents: 'none'
      }}/>

      {/* SIDEBAR - fixed left, full height */}
      <div className="hidden md:flex h-full shrink-0 z-10 relative">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* RIGHT SIDE - everything except sidebar */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        marginLeft: '0' 
      }}>

        {/* HEADER - top branding & profile */}
        <Header />

        {/* NAVBAR - navigation links */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* MAIN SCROLLABLE CONTENT */}
        <main 
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
          className={`transition-all duration-700 ease-out transform no-scrollbar ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          {/* SECTION 1 - Welcome Banner */}
          <section
            style={{
              ...glassBase,
              padding: '24px',
              borderLeft: '4px solid transparent',
              backgroundImage: 'linear-gradient(#1b2c3e, #1b2c3e), linear-gradient(180deg, #00c2cb, #7c3aed)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="flex flex-col gap-[8px]">
                <p className="text-[#00c2cb] font-semibold text-sm tracking-wide">Good Morning ️</p>
                <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, Prabodhya!</h1>
                <p className="text-white/50 text-sm">Thursday, 26 March 2026 · SLIIT Campus</p>
                
                <div className="flex flex-wrap items-center gap-[12px] mt-2">
                  <div className="flex items-center gap-[8px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-[8px] text-xs font-semibold text-white/80">
                   <span className="text-lg leading-none"></span> 2 new notifications
                  </div>
                  <div className="flex items-center gap-[8px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-[8px] text-xs font-semibold text-white/80">
                   <span className="text-lg leading-none"></span> 1 unread message
                  </div>
                  <div className="flex items-center gap-[8px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-[8px] text-xs font-semibold text-white/80">
                   <span className="text-lg leading-none"></span> 3 active listings
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-[12px] w-full md:w-auto mt-2 md:mt-0">
                <button className="px-[20px] py-[10px] rounded-[12px] font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[#00c2cb]/20"
                  style={{ background: 'linear-gradient(135deg, #00c2cb, #7c3aed)' }}
                >
                   Browse Marketplace
                </button>
                <button className="px-[20px] py-[10px] rounded-[12px] font-semibold text-white/90 border border-white/20 transition-all duration-300 hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
                >
                   View Resources
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2 - Stats (4 class cards) */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '100%' }} className="stats-grid overflow-x-auto pb-2 md:overflow-visible md:pb-0 hide-scrollbar-mobile">
            <style>{`
              @media (max-width: 1024px) {
                .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
              }
              @media (max-width: 640px) {
                .stats-grid { grid-template-columns: repeat(1, 1fr) !important; }
              }
            `}</style>
            
            {/* Card 1 */}
            <div className="group flex flex-col transition-all duration-300 cursor-pointer" style={{ ...glassBase, minHeight: '160px', gap: '12px' }}
              onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'rgba(0,194,203,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,194,203,0.1)';}}
              onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', width: '48px', height: '48px', background: '#00c2cb' }}>
                  
                </div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  <AnimatedCounter end={3} />
                </div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontWeight: 600, color: 'white', fontSize: '16px', marginBottom: '4px' }}>My Listings</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '12px' }}>2 available · 1 sold</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: 500, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                   +1 this week
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group flex flex-col transition-all duration-300 cursor-pointer" style={{ ...glassBase, minHeight: '160px', gap: '12px' }}
              onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.1)';}}
              onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', width: '48px', height: '48px', background: '#7c3aed' }}>
                  
                </div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  <AnimatedCounter end={12} />
                </div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontWeight: 600, color: 'white', fontSize: '16px', marginBottom: '4px' }}>Saved Resources</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '12px' }}>3 PDFs · 9 videos</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: 500, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                   +3 this week
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group flex flex-col transition-all duration-300 cursor-pointer" style={{ ...glassBase, minHeight: '160px', gap: '12px' }}
              onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,165,233,0.1)';}}
              onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', width: '48px', height: '48px', background: '#0ea5e9' }}>
                  
                </div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  <AnimatedCounter end={2} />
                </div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontWeight: 600, color: 'white', fontSize: '16px', marginBottom: '4px' }}>My Communities</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '12px' }}>Chess Club · Cricket</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: 500, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                   1 pending
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group flex flex-col transition-all duration-300 cursor-pointer" style={{ ...glassBase, minHeight: '160px', gap: '12px' }}
              onMouseEnter={(e) => {e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,0.1)';}}
              onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', width: '48px', height: '48px', background: '#f59e0b' }}>
                  
                </div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  <AnimatedCounter end={4.8} isFloat={true} />
                </div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontWeight: 600, color: 'white', fontSize: '16px', marginBottom: '4px' }}>Trust Score</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '12px' }}>Based on 6 reviews</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: 500, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                   Top 10%
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 - Two Column Split 60/40 */}
          <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-5">
            {/* LEFT: Listings */}
            <div className="lg:col-span-3 flex flex-col h-full" style={glassBase}>
              <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>My Listings</h2>
                <a href="#" style={sectionLinkStyle} className="hover:underline">View All →</a>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                
                {/* Row 1 */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 16px' }} className="group transition-colors hover:border-[#00c2cb]/30">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                    <span style={{ fontSize: '20px' }}></span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="group-hover:text-white transition-colors truncate" style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>Python Textbook</span>
                      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2px 8px', fontSize: '10px', color: 'rgba(255,255,255,0.5)', width: 'fit-content' }}>BOOKS</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%', gap: '4px' }}>
                    <span style={{ color: '#00c2cb', fontWeight: 600, fontSize: '14px' }}>Rs.800</span>
                    <div style={{ background: 'rgba(16,185,129,0.15)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '2px 8px', fontSize: '10px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span> Available
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '25%', gap: '8px', color: 'rgba(255,255,255,0.5)' }}>
                    <button className="hover:text-[#00c2cb] transition-colors">️</button>
                    <button className="hover:text-[#ef4444] transition-colors">️</button>
                  </div>
                </div>

                {/* Row 2 */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 16px' }} className="group transition-colors hover:border-[#00c2cb]/30">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                    <span style={{ fontSize: '20px' }}></span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="group-hover:text-white transition-colors truncate" style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>Scientific Calculator</span>
                      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2px 8px', fontSize: '10px', color: 'rgba(255,255,255,0.5)', width: 'fit-content' }}>TOOLS</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%', gap: '4px' }}>
                    <span style={{ color: '#00c2cb', fontWeight: 600, fontSize: '14px' }}>Rs.1200</span>
                    <div style={{ background: 'rgba(16,185,129,0.15)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '2px 8px', fontSize: '10px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span> Available
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '25%', gap: '8px', color: 'rgba(255,255,255,0.5)' }}>
                    <button className="hover:text-[#00c2cb] transition-colors">️</button>
                    <button className="hover:text-[#ef4444] transition-colors">️</button>
                  </div>
                </div>

                {/* Row 3 */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 16px', opacity: 0.6 }} className="group transition-colors hover:border-[#00c2cb]/30">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                    <span style={{ fontSize: '20px', filter: 'grayscale(1)' }}></span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="group-hover:text-white transition-colors truncate" style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', textDecoration: 'line-through' }}>Lab Coat (Size M)</span>
                      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2px 8px', fontSize: '10px', color: 'rgba(255,255,255,0.5)', width: 'fit-content' }}>CLOTHING</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%', gap: '4px' }}>
                    <span style={{ color: '#00c2cb', fontWeight: 600, fontSize: '14px' }}>Rs.500</span>
                    <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '2px 8px', fontSize: '10px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span> Sold
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '25%', gap: '8px', color: 'rgba(255,255,255,0.5)' }}>
                    <button className="hover:text-[#00c2cb] transition-colors" disabled>️</button>
                    <button className="hover:text-[#ef4444] transition-colors">️</button>
                  </div>
                </div>
              </div>
              
              <button 
                className="w-full mt-6 py-3 font-medium transition-colors hover:bg-white/5 hover:text-[#00c2cb] hover:border-[#00c2cb]"
                style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
              >
                + Add New Listing
              </button>
            </div>

            {/* RIGHT: Upcoming Events */}
            <div className="lg:col-span-2 flex flex-col h-full" style={glassBase}>
              <div style={sectionHeaderStyle}>
                <h2 style={sectionTitleStyle}>Upcoming Events</h2>
                <a href="#" style={{...sectionLinkStyle, color: '#7c3aed'}} className="hover:underline">View All →</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Event 1 */}
                <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', borderLeft: '3px solid #7c3aed', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>Chess Club Meeting</h3>
                    <div style={{ background: 'rgba(124,58,237,0.15)', borderRadius: '8px', border: '1px solid rgba(124,58,237,0.2)', color: '#7c3aed', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>CHESS CLUB</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                    <span> Tomorrow</span>
                    <span> 3:00 PM</span>
                    <span> Room 401</span>
                  </div>
                </div>

                {/* Event 2 */}
                <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', borderLeft: '3px solid #10b981', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>Cricket Practice</h3>
                    <div style={{ background: 'rgba(16,185,129,0.15)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>CRICKET</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                    <span> Sat Mar 29</span>
                    <span> 5:00 PM</span>
                    <span> Sports Ground</span>
                  </div>
                </div>

                {/* Event 3 */}
                <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', borderLeft: '3px solid #00c2cb', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>Coding Bootcamp</h3>
                    <div style={{ background: 'rgba(0,194,203,0.15)', borderRadius: '8px', border: '1px solid rgba(0,194,203,0.2)', color: '#00c2cb', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>IT SOCIETY</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                    <span> Sun Mar 30</span>
                    <span> 10:00 AM</span>
                    <span> Lab 302</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4 - Recent Resources */}
          <section>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Recent Resources</h2>
              <button 
                className="hover:scale-[1.03] transition-transform"
                style={{ background: 'linear-gradient(90deg, #00c2cb, #0ea5e9)', color: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                + Upload Resource
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Res 1 */}
              <div style={{ ...glassBase, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #f87171)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '16px' }}></div>
                <h3 style={{ fontWeight: 600, color: 'white', fontSize: '16px', marginBottom: '8px' }}>Data Structures Notes</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2px 8px', fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>IT2040</div>
                  <div style={{ color: '#00c2cb', fontSize: '12px', fontWeight: 600 }}>Y2 · S1</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
                  <span> 45 views</span>
                  <span>⬇ 12 downloads</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>Open →</button>
                  <button style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}></button>
                </div>
              </div>

              {/* Res 2 */}
              <div style={{ ...glassBase, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '16px' }}></div>
                <h3 style={{ fontWeight: 600, color: 'white', fontSize: '16px', marginBottom: '8px' }}>OOP Tutorial Video</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2px 8px', fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>IT2050</div>
                  <div style={{ color: '#00c2cb', fontSize: '12px', fontWeight: 600 }}>Y2 · S1</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
                  <span> 120 views</span>
                  <span>⬇ 0 downloads</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>Open →</button>
                  <button style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}></button>
                </div>
              </div>

              {/* Res 3 */}
              <div style={{ ...glassBase, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '16px' }}></div>
                <h3 style={{ fontWeight: 600, color: 'white', fontSize: '16px', marginBottom: '8px' }}>Database Lab Manual</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2px 8px', fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>IT3040</div>
                  <div style={{ color: '#00c2cb', fontSize: '12px', fontWeight: 600 }}>Y3 · S1</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
                  <span> 89 views</span>
                  <span>⬇ 34 downloads</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>Open →</button>
                  <button style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}></button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 - Quick Actions */}
          <section>
            <h2 style={{...sectionTitleStyle, marginBottom: '16px'}}>Quick Actions</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              <button className="group" style={{ ...glassBase, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'rgba(0,194,203,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #00c2cb, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }} className="transition-transform group-hover:-translate-y-1"></div>
                <span style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>Sell an Item</span>
              </button>
              
              <button className="group" style={{ ...glassBase, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #d946ef)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }} className="transition-transform group-hover:-translate-y-1"></div>
                <span style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>Upload Resource</span>
              </button>

              <button className="group" style={{ ...glassBase, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }} className="transition-transform group-hover:-translate-y-1"></div>
                <span style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>Join a Club</span>
              </button>

              <button className="group" style={{ ...glassBase, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }} className="transition-transform group-hover:-translate-y-1"></div>
                <span style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>Edit Profile</span>
              </button>

              <button className="group" style={{ ...glassBase, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #eab308)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }} className="transition-transform group-hover:-translate-y-1"></div>
                <span style={{ fontSize: '14px', color: 'white', fontWeight: 500 }}>My Reviews</span>
              </button>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
