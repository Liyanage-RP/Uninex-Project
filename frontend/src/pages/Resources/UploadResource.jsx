import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import HeaderComp from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// SVG Icons
const UploadCloudIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const PdfFileIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const VideoLinkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const DocPdfIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

export default function UploadResource() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [uploadType, setUploadType] = useState('pdf'); // 'pdf' or 'video'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    moduleCode: '',
    year: '1',
    semester: '1',
    videoUrl: ''
  });
  const [file, setFile] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Validate Video URL
  const isValidVideoUrl = (url) => {
    const patterns = [
      /youtube\.com\/watch/,
      /youtu\.be\//,
      /drive\.google\.com/,
      /vimeo\.com/
    ];
    return patterns.some(p => p.test(url));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'moduleCode' ? value.toUpperCase() : value
    }));
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      setErrorMessage(' Only PDF files are allowed. Use video URL for other formats.');
      setFile(null);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage(' File size must be less than 10MB.');
      setFile(null);
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    setErrorMessage('');
    setFile(selectedFile);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.title || formData.title.trim().length < 5)
      errs.title = 'Title must be at least 5 characters.';
    else if (formData.title.trim().length > 100)
      errs.title = 'Title must be 100 characters or less.';
    if (!formData.subject || formData.subject.trim().length < 3)
      errs.subject = 'Subject must be at least 3 characters.';
    if (formData.moduleCode && !/^[A-Za-z]{2,4}[0-9]{3,4}$/.test(formData.moduleCode))
      errs.moduleCode = 'Format must be like "IT2040" (2–4 letters then 3–4 numbers).';
    if (uploadType === 'pdf' && !file)
      errs.file = 'Please select a valid PDF file.';
    if (uploadType === 'video' && !formData.videoUrl)
      errs.videoUrl = 'Please enter a video URL.';
    else if (uploadType === 'video' && formData.videoUrl && !isValidVideoUrl(formData.videoUrl))
      errs.videoUrl = 'Only YouTube, Google Drive or Vimeo URLs are supported.';
    return errs;
  };

  const isFormValid = () => Object.keys(validateForm()).length === 0;

  const handleSubmit = async (e) => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setErrorMessage('Please fix the errors below before submitting.');
      setTimeout(() => setErrorMessage(''), 4000);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setUploadProgress(10);
    setErrorMessage('');

    try {
      // Fake progress animation
      const interval = setInterval(() => {
        setUploadProgress(prev => prev < 90 ? prev + 10 : prev);
      }, 300);

      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        formPayload.append(key, formData[key]);
      });
      formPayload.append('fileType', uploadType);
      if (uploadType === 'pdf' && file) {
        formPayload.append('file', file);
      }

      await axiosInstance.post('/resources', formPayload);

      clearInterval(interval);
      setUploadProgress(100);
      setIsSuccess(true);
      addToast('Resource uploaded successfully!', 'success');

    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to upload resource');
      setUploadProgress(0);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: 'white',
    outline: 'none',
    width: '100%',
    fontSize: '15px'
  };

  return (
    <div className="flex h-screen bg-[#080d14] font-['Inter'] text-white overflow-hidden selection:bg-[#00c2cb] selection:text-white">
      {/* SIDEBAR */}
      <div className="hidden md:flex h-full shrink-0 z-10 relative">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1, marginLeft: '0' }}>
        
        <HeaderComp />
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* MAIN SCROLLABLE CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-[12px] fade-up flex items-center gap-3 backdrop-blur-xl border border-red-500/30 shadow-[0_10px_40px_rgba(239,68,68,0.2)]" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
          <span className="text-red-500 font-bold whitespace-nowrap">{errorMessage}</span>
        </div>
      )}

      <div className="max-w-[680px] mx-auto w-full pt-10">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate('/resources')}
          className="text-white/40 hover:text-white font-medium text-sm transition-colors mb-6 flex items-center gap-2"
        >
          ← Back to Resources
        </button>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-[24px] fade-up" style={{ background: 'rgba(16,185,129,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6 text-emerald-500">
              <CheckCircleIcon />
            </div>
            <h2 className="text-[30px] font-black text-emerald-400 mb-2">Upload Successful!</h2>
            <p className="text-white font-semibold text-[16px] mb-1">Your PDF has been uploaded successfully.</p>
            <p className="text-white/50 text-sm mb-10 max-w-[320px]">Your resource is now live and available for all students to view and download.</p>
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={() => { setIsSuccess(false); setFile(null); setFormData({ ...formData, title: '', description: '', videoUrl: '' }); }}
                className="flex-1 h-[52px] rounded-[12px] font-bold text-white transition-colors hover:bg-white/5"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Upload Another
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="flex-1 h-[52px] rounded-[12px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' }}
              >
                View Resources
              </button>
            </div>
          </div>
        ) : (
          /* UPLOAD FORM */
          <div className="rounded-[24px] overflow-hidden fade-up p-8 md:p-10" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            
            <Header title="Upload Study Resource" sub="Share your notes with fellow students" />

            {/* TYPE TOGGLE */}
            <div className="flex p-1 rounded-[14px] mb-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                type="button"
                onClick={() => setUploadType('pdf')}
                className={`flex-1 h-[48px] rounded-[10px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 ${uploadType === 'pdf' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                style={uploadType === 'pdf' ? { background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' } : {}}
              >
                <DocPdfIcon /> PDF Document
              </button>
              <button
                type="button"
                onClick={() => setUploadType('video')}
                className={`flex-1 h-[48px] rounded-[10px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 ${uploadType === 'video' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                style={uploadType === 'video' ? { background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' } : {}}
              >
                <VideoLinkIcon /> Video Link
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Title */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-white/90">Resource Title *</label>
                  <span className="text-xs text-white/40">{formData.title.length}/100</span>
                </div>
                <input type="text" name="title" value={formData.title} onChange={handleChange} maxLength={100} placeholder="e.g. Data Structures Complete Notes" style={{...inputStyle, border: fieldErrors.title ? '1px solid #ef4444' : inputStyle.border}}/>
                {fieldErrors.title && <p className="text-red-400 text-xs mt-1">{fieldErrors.title}</p>}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium text-white/90">Description</label>
                  <span className="text-xs text-white/40">{formData.description.length}/500</span>
                </div>
                <textarea name="description" value={formData.description} onChange={handleChange} maxLength={500} rows={4} placeholder="What does this resource cover?" className="resize-none" style={inputStyle}/>
              </div>

              {/* 2-Column Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/90">Subject *</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g. Data Structures" style={{...inputStyle, border: fieldErrors.subject ? '1px solid #ef4444' : inputStyle.border}}/>
                  {fieldErrors.subject && <p className="text-red-400 text-xs mt-1">{fieldErrors.subject}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/90">Module Code</label>
                  <input type="text" name="moduleCode" value={formData.moduleCode} onChange={handleChange} placeholder="e.g. IT2040" style={{...inputStyle, border: fieldErrors.moduleCode ? '1px solid #ef4444' : inputStyle.border}}/>
                  {fieldErrors.moduleCode && <p className="text-red-400 text-xs mt-1">{fieldErrors.moduleCode}</p>}
                </div>
              </div>

              {/* 2-Column Row: Year & Semester */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/90">Year *</label>
                  <select name="year" value={formData.year} onChange={handleChange} className="appearance-none cursor-pointer bg-[#0A101A]" style={inputStyle}>
                    <option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/90">Semester *</label>
                  <select name="semester" value={formData.semester} onChange={handleChange} className="appearance-none cursor-pointer bg-[#0A101A]" style={inputStyle}>
                    <option value="1">Semester 1</option><option value="2">Semester 2</option>
                  </select>
                </div>
              </div>

              {/* CONDITIONAL MEDIA INPUT */}
              <div className="mt-2 pt-6 border-t border-white/5">
                
                {uploadType === 'pdf' ? (
                  // PDF UPLOAD AREA
                  <div className="flex flex-col gap-2 fade-up">
                    <label className="text-sm font-medium text-white/90">Upload PDF *</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className="relative h-[200px] w-full rounded-[16px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden"
                      style={{
                        background: isDragging ? 'rgba(0,194,203,0.1)' : 'rgba(0,194,203,0.03)',
                        border: isDragging ? '2px dashed #00c2cb' : errorMessage.includes('PDF') ? '2px dashed #ef4444' : '2px dashed rgba(0,194,203,0.3)',
                        animation: errorMessage.includes('PDF') ? 'shake 0.5s ease' : 'none'
                      }}
                    >
                      <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                      {file ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center z-0 w-full h-full bg-emerald-500/5 pointer-events-none">
                          <div className="mb-3"><PdfFileIcon /></div>
                          <span className="text-white font-bold text-sm truncate w-[80%] mb-1">{file.name}</span>
                          <span className="text-white/40 text-xs mb-3">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-1.5">
                            <CheckIcon /> Ready to upload
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center z-0 pointer-events-none text-[#00c2cb]">
                          <div className="mb-4 opacity-70"><UploadCloudIcon /></div>
                          <span className="text-white font-bold text-base mb-1">Drag & drop PDF here</span>
                          <span className="text-white/50 text-sm mb-4">or click to browse your computer</span>
                          <span className="text-white/30 text-xs">Max file size: 10MB &middot; PDF only</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // VIDEO URL AREA
                  <div className="flex flex-col gap-2 fade-up">
                    <label className="text-sm font-medium text-white/90">Video URL *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><LinkIcon /></span>
                      <input
                        type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange}
                        placeholder="Paste YouTube or Google Drive URL"
                        className="w-full text-[15px] pl-[44px] pr-[44px] transition-colors"
                        style={{ ...inputStyle, border: formData.videoUrl && !isValidVideoUrl(formData.videoUrl) ? '1px solid #ef4444' : formData.videoUrl && isValidVideoUrl(formData.videoUrl) ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)' }}
                      />
                      {formData.videoUrl && isValidVideoUrl(formData.videoUrl) && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2"><CheckIcon /></span>
                      )}
                      {formData.videoUrl && !isValidVideoUrl(formData.videoUrl) && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2"><XIcon /></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-white/40 mr-1">Supported:</span>
                      {['YouTube', 'Google Drive', 'Vimeo'].map(p => (
                        <span key={p} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-white/60">{p}</span>
                      ))}
                    </div>
                    {formData.videoUrl && isValidVideoUrl(formData.videoUrl) && (
                      <div className="mt-4 p-4 rounded-[12px] bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-4 fade-up">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/20 shrink-0 text-emerald-500">
                          <CheckIcon />
                        </div>
                        <div>
                          <h4 className="text-emerald-500 font-bold text-sm mb-1">Video link verified</h4>
                          <a href={formData.videoUrl} target="_blank" rel="noreferrer" className="text-[#00c2cb] text-xs hover:underline line-clamp-1">
                            {formData.videoUrl}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit" 
                disabled={!isFormValid() || isSubmitting}
                className="w-full h-[54px] rounded-[14px] flex items-center justify-center gap-3 text-white font-bold text-[16px] mt-4 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' }}
              >
                {/* Progress bar overlay during submisison */}
                {isSubmitting && (
                  <div className="absolute top-0 left-0 h-full bg-white/20 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                )}
                
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white spin-ring"></div> Uploading...</> : '⬆ Upload Resource'}
                </span>
              </button>

            </form>
          </div>
        )}

      </div>

      <Footer />
      </main>
      </div>
    </div>
  );
}

const Header = ({ title, sub }) => (
  <div className="mb-10 text-center md:text-left">
    <h1 className="text-[26px] md:text-[32px] font-bold text-white mb-2 leading-tight">{title}</h1>
    <p className="text-white/50 text-[15px]">{sub}</p>
  </div>
);
