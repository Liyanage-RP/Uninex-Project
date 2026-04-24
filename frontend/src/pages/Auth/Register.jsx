import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    faculty: 'Faculty of Computing',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Weak', color: '#ef4444' });

  const { register } = useAuth();
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for field
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    
    // Real-time password strength
    if (name === 'password') {
      const len = value.length;
      if (len === 0) setPasswordStrength({ score: 0, text: 'Weak', color: '#ef4444' });
      else if (len < 6) setPasswordStrength({ score: 1, text: 'Weak', color: '#ef4444' });
      else if (len < 8) setPasswordStrength({ score: 2, text: 'Fair', color: '#f59e0b' });
      else if (!/\d/.test(value) || !/[A-Z]/.test(value)) setPasswordStrength({ score: 3, text: 'Good', color: '#eab308' });
      else setPasswordStrength({ score: 4, text: 'Strong', color: '#10b981' });
    }
  };

  // Step Validations
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 3) newErrors.name = 'Full name must be at least 3 characters';
    if (!formData.studentId || !/^(IT|CS|BM|EN)\d{8}$/i.test(formData.studentId)) newErrors.studentId = 'Check format (e.g. IT22280374)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.email.endsWith('@my.sliit.lk')) newErrors.email = 'Must end with @my.sliit.lk';
    if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    setIsSubmitting(true);
    const res = await register(formData);
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      // Show error on current UI
      setErrors({ submit: res.message });
    }
  };

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      navigate('/login');
    }
  }, [isSuccess, countdown, navigate]);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-[#080d14] font-['Inter']">
      
      {/* 
        ========================================
        LEFT SIDE: EXACTLY SAME AS LOGIN
        ========================================
      */}
      <div 
        className="hidden lg:flex flex-col relative w-[60%] shrink-0 h-full overflow-hidden p-[48px]"
        style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b35 50%, #0a1628 100%)' }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full spin-ring" style={{ background: 'radial-gradient(circle, rgba(0,194,203,0.06), transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full spin-ring" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)', filter: 'blur(50px)', animationDirection: 'reverse', zIndex: 0 }}></div>
        <div className="relative z-10 flex flex-col h-full w-full justify-between">
          <div>
            <h1 className="text-[54px] font-black tracking-tighter mb-2" style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UNINEXUS</h1>
            <p className="text-[20px] font-medium text-white/50 tracking-wide">Your University. Connected.</p>
          </div>
          <div className="relative flex-1 w-full my-8">
            <div className="absolute top-[10%] left-[5%] w-[340px] float-1" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(0,194,203,0.1)' }}></div>
                <div><h3 className="text-white font-bold text-[15px] mb-1">Campus Marketplace</h3><p className="text-white/50 text-[13px]">Buy & sell items securely with verified university students.</p></div>
              </div>
            </div>
            <div className="absolute top-[40%] right-[10%] w-[340px] float-2" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }}></div>
                <div><h3 className="text-white font-bold text-[15px] mb-1">Resource Hub</h3><p className="text-white/50 text-[13px]">Share lecture notes, PDFs, and essential study materials.</p></div>
              </div>
            </div>
            <div className="absolute bottom-[15%] left-[15%] w-[340px] float-3" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.1)' }}></div>
                <div><h3 className="text-white font-bold text-[15px] mb-1">Communities</h3><p className="text-white/50 text-[13px]">Join active clubs, sports teams, and upcoming events.</p></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] rounded-lg bg-white/10 flex items-center justify-center border border-white/20"><span className="text-white font-bold text-xs tracking-wider">SLIIT</span></div>
            <span className="text-white/40 text-sm font-medium tracking-wide">Faculty of Computing · SLIIT</span>
          </div>
        </div>
      </div>

      {/* 
        ========================================
        RIGHT SIDE: REGISTRATION FORM (40%)
        ========================================
      */}
      <div className="flex-1 h-full overflow-y-auto no-scrollbar flex flex-col px-[32px] md:px-[64px] py-[64px] relative" style={{ background: '#080d14' }}>
        
        {isSuccess ? (
          <div className="w-full max-w-[420px] m-auto flex flex-col items-center text-center fade-up">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ strokeDasharray: 100, animation: 'checkmark 1s ease-out forwards' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[32px] font-bold text-white mb-2">Account Created!</h1>
            <p className="text-white/60 mb-8 max-w-[300px]">Welcome to UniNexus, {formData.name.split(' ')[0]}! Your SLIIT student account is ready.</p>
            
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${(countdown / 3) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm font-semibold text-emerald-500">Redirecting to login in {countdown}s...</p>
          </div>
        ) : (
          <div className="w-full max-w-[420px] mx-auto m-auto relative">
            
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-[32px] font-bold text-white mb-2 leading-tight">Create Account</h1>
              <p className="text-white/50 text-[15px]">Join UniNexus — SLIIT's student platform</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                {[1, 2].map(s => (
                  <div key={s} className={`h-2 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-[#00c2cb]' : step > s ? 'w-4 bg-[#7c3aed]' : 'w-4 bg-white/10'}`}></div>
                ))}
              </div>
              <p className="text-xs font-bold text-[#00c2cb] uppercase tracking-wider">
                {step === 1 ? 'Step 1: Personal Info' : 'Step 2: Account Setup'}
              </p>
            </div>

            {errors.submit && (
              <div className="mb-6 w-full p-4 rounded-xl flex items-start gap-3 fade-up" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <span className="text-[#ef4444] text-lg"></span><p className="text-[#ef4444] text-sm font-medium pt-0.5">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* === STEP 1 === */}
              {step === 1 && (
                <div className="flex flex-col gap-5 fade-up">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#00c2cb]"></span>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Prabodhya K.L.N" className="w-full text-[15px] text-white outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: errors.name ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px 14px 44px' }}/>
                    </div>
                    {errors.name && <span className="text-[#ef4444] text-xs">{errors.name}</span>}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">Student ID</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#00c2cb]"></span>
                      <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g. IT22280374" className="w-full text-[15px] text-white outline-none uppercase" style={{ background: 'rgba(255,255,255,0.04)', border: errors.studentId ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px 14px 44px' }}/>
                    </div>
                    {errors.studentId && <span className="text-[#ef4444] text-xs">{errors.studentId}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">Faculty</label>
                    <select name="faculty" value={formData.faculty} onChange={handleChange} className="w-full text-[15px] text-white outline-none appearance-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px' }}>
                      <option className="bg-[#080d14] text-white" value="Faculty of Computing">Faculty of Computing</option>
                      <option className="bg-[#080d14] text-white" value="Faculty of Engineering">Faculty of Engineering</option>
                      <option className="bg-[#080d14] text-white" value="Faculty of Business">Faculty of Business</option>
                      <option className="bg-[#080d14] text-white" value="Faculty of Humanities">Faculty of Humanities</option>
                    </select>
                  </div>

                  <button type="button" onClick={() => { if(validateStep1()) setStep(2) }} className="w-full h-[52px] rounded-[12px] flex items-center justify-center gap-2 text-white font-bold mt-4" style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' }}>
                    Next Step →
                  </button>
                </div>
              )}

              {/* === STEP 2 === */}
              {step === 2 && (
                <div className="flex flex-col gap-5 fade-up">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">University Email</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#00c2cb]">️</span>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="yourname@my.sliit.lk" className="w-full text-[15px] text-white outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: errors.email ? '1px solid #ef4444' : formData.email.endsWith('@my.sliit.lk') ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 44px' }}/>
                      {formData.email.endsWith('@my.sliit.lk') && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold"></span>}
                    </div>
                    {errors.email && <span className="text-[#ef4444] text-xs">{errors.email}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#00c2cb]"></span>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" className="w-full text-[15px] text-white outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px 14px 44px' }}/>
                    </div>
                    {/* Strength Meter */}
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4].map(s => (
                        <div key={s} className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full transition-all duration-300" style={{ width: formData.password.length > 0 && passwordStrength.score >= s ? '100%' : '0%', background: passwordStrength.color }}></div>
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: passwordStrength.color }}>{passwordStrength.text}</span>
                    {errors.password && <span className="text-[#ef4444] text-xs mt-[-10px]">{errors.password}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#00c2cb]"></span>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" className="w-full text-[15px] text-white outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: errors.confirmPassword ? '1px solid #ef4444' : (formData.confirmPassword && formData.password === formData.confirmPassword) ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 44px' }}/>
                      {formData.confirmPassword && formData.password === formData.confirmPassword && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold"></span>}
                    </div>
                    {errors.confirmPassword && <span className="text-[#ef4444] text-xs">{errors.confirmPassword}</span>}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button type="button" onClick={() => setStep(1)} disabled={isSubmitting} className="w-[100px] h-[52px] rounded-[12px] text-white font-bold transition-colors hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>← Back</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 h-[52px] rounded-[12px] flex items-center justify-center text-white font-bold gap-2 transition-transform hover:scale-[1.02]" style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' }}>
                      {isSubmitting ? <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white spin-ring"></div> Creating...</> : 'Create Account'}
                    </button>
                  </div>
                </div>
              )}



            </form>

            {/* Bottom Links */}
            {!isSubmitting && (
              <div className="mt-8 text-center">
                <p className="text-[14px] text-white/60">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-[#00c2cb] hover:underline">
                    Sign in here →
                  </Link>
                </p>
              </div>
            )}

          </div>
        )}
      </div>
      
    </div>
  );
}
