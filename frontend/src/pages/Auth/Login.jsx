import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (role === 'student' && !email.endsWith('@my.sliit.lk')) {
      errors.email = 'Use your SLIIT university email (@my.sliit.lk)';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Minimum 6 characters required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate real delay for smooth UI transition
    await new Promise(resolve => setTimeout(resolve, 800));

    // Call AuthContext login
    // Note: Role is inherently validated on the backend via token/db,
    // but we requested specific redirect logic based on the returned role.
    const res = await login(email, password);
    
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(`Welcome to the ${res.role === 'admin' ? 'Admin' : 'Student'} Portal!`);
      setTimeout(() => {
        if (res.role === 'admin') navigate('/admin/dashboard');
        else navigate('/dashboard');
      }, 1500);
    } else {
      setSubmitError(res.message);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#080d14] font-['Inter']">
      
      {/* 
        ========================================
        LEFT SIDE: DECORATIVE PANEL (60%)
        ========================================
      */}
      <div 
        className="hidden lg:flex flex-col relative w-[60%] shrink-0 h-full overflow-hidden p-[48px]"
        style={{
          background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b35 50%, #0a1628 100%)'
        }}
      >
        {/* Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full spin-ring" 
             style={{ background: 'radial-gradient(circle, rgba(0,194,203,0.06), transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full spin-ring" 
             style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)', filter: 'blur(50px)', animationDirection: 'reverse', zIndex: 0 }}></div>

        {/* Content Wrapper (z-index above blobs) */}
        <div className="relative z-10 flex flex-col h-full w-full justify-between">
          
          {/* Top Branding */}
          <div>
            <h1 className="text-[54px] font-black tracking-tighter mb-2"
                style={{
                  background: 'linear-gradient(90deg, #00c2cb, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
              UNINEXUS
            </h1>
            <p className="text-[20px] font-medium text-white/50 tracking-wide">
              Your University. Connected.
            </p>
          </div>

          {/* Floating Glass Cards Area */}
          <div className="relative flex-1 w-full my-8">
            
            {/* Card 1 */}
            <div className="absolute top-[10%] left-[5%] w-[340px] float-1"
                 style={{
                   background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                   border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px',
                   boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                 }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(0,194,203,0.1)' }}></div>
                <div>
                  <h3 className="text-white font-bold text-[15px] mb-1">Campus Marketplace</h3>
                  <p className="text-white/50 text-[13px] leading-relaxed">Buy & sell items securely with verified university students.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="absolute top-[40%] right-[10%] w-[340px] float-2"
                 style={{
                   background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                   border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px',
                   boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                 }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }}></div>
                <div>
                  <h3 className="text-white font-bold text-[15px] mb-1">Resource Hub</h3>
                  <p className="text-white/50 text-[13px] leading-relaxed">Share lecture notes, PDFs, and essential study materials.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="absolute bottom-[15%] left-[15%] w-[340px] float-3"
                 style={{
                   background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                   border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px',
                   boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                 }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.1)' }}></div>
                <div>
                  <h3 className="text-white font-bold text-[15px] mb-1">Communities</h3>
                  <p className="text-white/50 text-[13px] leading-relaxed">Join active clubs, sports teams, and upcoming events.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Branding */}
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-xs tracking-wider">SLIIT</span>
            </div>
            <span className="text-white/40 text-sm font-medium tracking-wide">
              Faculty of Computing · SLIIT
            </span>
          </div>

        </div>
      </div>

      {/* 
        ========================================
        RIGHT SIDE: LOGIN FORM (40%)
        ========================================
      */}
      <div className="flex-1 h-full overflow-y-auto no-scrollbar flex flex-col justify-center px-[32px] md:px-[64px] pb-[64px] relative"
           style={{ background: '#080d14' }}>
        
        <div className="w-full max-w-[420px] mx-auto fade-up">
          
          {/* Top Logo & Welcome */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-[24px] font-black tracking-tight mb-4 inline-block lg:hidden"
                style={{
                  background: 'linear-gradient(90deg, #00c2cb, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
              UNINEXUS
            </h2>
            <h1 className="text-[32px] font-bold text-white mb-2 leading-tight">Welcome back</h1>
            <p className="text-white/50 text-[15px]">Sign in to your UniNexus account</p>
          </div>

          {/* Role Toggle */}
          <div className="flex w-full rounded-[12px] p-1 mb-8"
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              type="button"
              onClick={() => { setRole('student'); setFormErrors({}); setSubmitError(''); }}
              className="flex-1 h-[42px] rounded-[10px] text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              style={role === 'student' 
                ? { background: 'linear-gradient(90deg, #00c2cb, #7c3aed)', color: 'white', boxShadow: '0 0 20px rgba(0,194,203,0.3)' } 
                : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }}
            >
               Student
            </button>
            <button
              type="button"
              onClick={() => { setRole('admin'); setFormErrors({}); setSubmitError(''); }}
              className="flex-1 h-[42px] rounded-[10px] text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              style={role === 'admin'
                ? { background: 'linear-gradient(90deg, #f59e0b, #ef4444)', color: 'white', boxShadow: '0 0 20px rgba(239,68,68,0.3)' }
                : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }}
            >
              ️ Admin
            </button>
          </div>

          {role === 'admin' && (
            <div className="mb-6 p-3 rounded-lg flex items-center gap-3 fade-up"
                 style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <span className="text-[18px]"></span>
              <p className="text-[#f59e0b] text-xs font-medium">Admin access is restricted and monitored.</p>
            </div>
          )}

          {/* Banners */}
          {submitError && (
            <div className="mb-6 w-full p-4 rounded-xl flex items-start gap-3 fade-up"
                 style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span className="text-[#ef4444] text-lg"></span>
              <p className="text-[#ef4444] text-sm font-medium pt-0.5">{submitError}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 w-full p-4 rounded-xl flex items-start gap-3 fade-up"
                 style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span className="text-[#10b981] text-lg"></span>
              <p className="text-[#10b981] text-sm font-medium pt-0.5">{successMsg}</p>
            </div>
          )}

          {/* The Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/90">University Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: role === 'admin' ? '#f59e0b' : '#00c2cb' }}>️</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@my.sliit.lk"
                  className="w-full text-[15px] text-white outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: formErrors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '14px 16px 14px 44px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = role === 'admin' ? '#f59e0b' : '#00c2cb';
                    e.target.style.boxShadow = `0 0 0 3px ${role === 'admin' ? 'rgba(245,158,11,0.1)' : 'rgba(0,194,203,0.1)'}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = formErrors.email ? '#ef4444' : 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {formErrors.email && <span className="text-[#ef4444] text-[13px] font-medium pl-1 fade-up">{formErrors.email}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/90">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: role === 'admin' ? '#f59e0b' : '#00c2cb' }}></span>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-[15px] text-white outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: formErrors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '14px 44px 14px 44px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = role === 'admin' ? '#f59e0b' : '#00c2cb';
                    e.target.style.boxShadow = `0 0 0 3px ${role === 'admin' ? 'rgba(245,158,11,0.1)' : 'rgba(0,194,203,0.1)'}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = formErrors.password ? '#ef4444' : 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-lg"
                >
                  {showPassword ? '' : '‍'}
                </button>
              </div>
              {formErrors.password && <span className="text-[#ef4444] text-[13px] font-medium pl-1 fade-up">{formErrors.password}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-1 mb-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border transition-colors flex items-center justify-center"
                     style={{
                       background: 'rgba(255,255,255,0.05)',
                       borderColor: 'rgba(255,255,255,0.2)'
                     }}>
                  {/* Checkbox visual placeholder - controlled native inputs usually need heavy styling, so we use a visual cue */}
                  <input type="checkbox" className="opacity-0 absolute w-4 h-4 cursor-pointer" 
                         onChange={(e) => {
                           const box = e.target.previousElementSibling;
                           if(e.target.checked) box.style.background = (role === 'admin' ? '#f59e0b' : '#00c2cb');
                           else box.style.background = 'rgba(255,255,255,0.05)';
                         }} />
                </div>
                <span className="text-[13px] text-white/60 group-hover:text-white transition-colors">Remember me</span>
              </label>
              
              <Link to="/forgot-password" 
                    className="text-[13px] font-semibold hover:underline"
                    style={{ color: role === 'admin' ? '#f59e0b' : '#00c2cb' }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting || !!successMsg}
              className="w-full h-[52px] rounded-[12px] flex items-center justify-center gap-3 text-white font-bold text-[16px] transition-all duration-300 disabled:opacity-70 shadow-lg"
              style={{
                background: role === 'admin' 
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                  : 'linear-gradient(90deg, #00c2cb, #7c3aed)',
                transform: isSubmitting ? 'scale(1)' : 'scale(1)',
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white spin-ring"></div>
                  Signing in...
                </>
              ) : (
                role === 'admin' ? 'Admin Sign In' : 'Sign In'
              )}
            </button>

          </form>

          {/* Bottom Links */}
          <div className="mt-8">
            <p className="text-center text-[14px] text-white/60">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold hover:underline" style={{ color: role === 'admin' ? '#f59e0b' : '#00c2cb' }}>
                Create Account →
              </Link>
            </p>

            <div className="flex items-center gap-4 my-8 opacity-40">
              <div className="flex-1 h-px border-t border-white" style={{ borderStyle: 'space' }}></div>
              <span className="text-xs font-black tracking-widest text-white">OR</span>
              <div className="flex-1 h-px border-t border-white"></div>
            </div>

            <button className="w-full h-[48px] rounded-[12px] flex items-center justify-center font-semibold text-sm transition-colors text-white/70 hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Login with Student ID instead
            </button>
          </div>

        </div>
      </div>
      
      <style>{`
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
