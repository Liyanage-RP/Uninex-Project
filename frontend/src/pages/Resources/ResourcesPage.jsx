import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ResourceCard from '../../components/ResourceCard';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaTrophy as Trophy, FaEye as Eye, FaDownload as Download } from 'react-icons/fa';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [resources, setResources] = useState([]);
  const [popular, setPopular] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [topResources, setTopResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // View toggle
  const [viewMode, setViewMode] = useState('grid');
  
  // Search state decoupled from instant filter to allow debounce
  const [searchInput, setSearchInput] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    year: '',
    semester: '',
    fileType: '',
    sortBy: 'createdAt'
  });

  const [pagination, setPagination] = useState({
    page: 1, pages: 1, total: 0
  });

  const [showConfirmModal, setShowConfirmModal] = useState(null);
  
  // Edit Modal State
  const [editingResource, setEditingResource] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', subject: '', moduleCode: '', description: '' });
  const [editErrors, setEditErrors] = useState({});

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch API Data
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: 12
      }).toString();

      const { data } = await axiosInstance.get(`/resources?${qs}`);
      setResources(data.data);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      console.error(err);
      addToast('Failed to load resources', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, addToast]);

  const fetchPopular = async () => {
    try {
      const { data } = await axiosInstance.get('/resources/popular');
      setPopular(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const { data } = await axiosInstance.get('/bookmarks');
      const ids = data.data.map(b => b.resourceId._id || b.resourceId);
      setBookmarks(ids);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    fetchPopular();
    fetchBookmarks();
    
    const fetchTopResources = async () => {
      try {
        const { data } = await axiosInstance.get('/resources/top');
        setTopResources(data.data);
      } catch (err) {
        addToast('Failed to load top resources', 'error');
      }
    };
    fetchTopResources();
  }, [addToast]);

  // Handlers
  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({ search: '', year: '', semester: '', fileType: '', sortBy: 'createdAt' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBookmark = async (resourceId) => {
    try {
      if (bookmarks.includes(resourceId)) {
        await axiosInstance.delete(`/bookmarks/${resourceId}`);
        setBookmarks(prev => prev.filter(id => id !== resourceId));
        addToast('Removed from bookmarks', 'info');
      } else {
        await axiosInstance.post('/bookmarks', { resourceId });
        setBookmarks(prev => [...prev, resourceId]);
        addToast('Saved to bookmarks', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Bookmark action failed', 'error');
    }
  };

  const handleView = (resource) => {
    navigate(`/resources/${resource._id}`);
  };

  const handleDownload = async (resource) => {
    const resourceId = resource._id || resource;
    try {
      // 1. Tell backend to increment counts
      const { data } = await axiosInstance.put(`/resources/${resourceId}/download`);
      const updatedResource = data.data;

      // 2. Open file/url natively
      const targetUrl = updatedResource.fileType === 'pdf' ? `http://localhost:5000${updatedResource.fileUrl}` : updatedResource.videoUrl;
      window.open(targetUrl, '_blank');

      // 3. Update local state to reflect new downloadCount instantly
      setResources(prev => prev.map(r => r._id === resourceId ? { ...r, downloadCount: r.downloadCount + 1 } : r));
      setPopular(prev => prev.map(r => r._id === resourceId ? { ...r, downloadCount: r.downloadCount + 1 } : r));
    } catch (err) {
      addToast('Failed to open resource', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/resources/${showConfirmModal}`);
      setResources(prev => prev.filter(r => r._id !== showConfirmModal));
      setPopular(prev => prev.filter(r => r._id !== showConfirmModal));
      addToast('Resource deleted permanently', 'success');
      setShowConfirmModal(null);
    } catch (err) {
      console.error(err);
      addToast('Failed to delete resource', 'error');
    }
  };

  const openEdit = (res) => {
    setEditingResource(res);
    setEditForm({
      title: res.title,
      subject: res.subject,
      moduleCode: res.moduleCode || '',
      description: res.description || ''
    });
    setEditErrors({});
  };

  const validateEditForm = () => {
    const errs = {};
    if (!editForm.title || editForm.title.trim().length < 5)
      errs.title = 'Title must be at least 5 characters.';
    else if (editForm.title.length > 100)
      errs.title = 'Title must be 100 characters or less.';
    if (!editForm.subject || editForm.subject.trim().length < 3)
      errs.subject = 'Subject must be at least 3 characters.';
    if (editForm.moduleCode && !/^[A-Za-z]{2,4}[0-9]{3,4}$/.test(editForm.moduleCode))
      errs.moduleCode = 'Must match format like "IT2040".';
    return errs;
  };

  const handleEditSave = async () => {
    const errs = validateEditForm();
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }
    try {
      await axiosInstance.put(`/resources/${editingResource._id}`, editForm);
      setResources(prev => prev.map(r => r._id === editingResource._id ? { ...r, ...editForm } : r));
      setPopular(prev => prev.map(r => r._id === editingResource._id ? { ...r, ...editForm } : r));
      addToast('Resource updated successfully', 'success');
      setEditingResource(null);
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update resource', 'error');
    }
  };

  // Glass custom styles for inputs
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'white',
    outline: 'none',
  };

  return (
    <div className="flex h-screen bg-[#080d14] font-['Inter'] text-white overflow-hidden selection:bg-[#00c2cb] selection:text-white">
      {/* SIDEBAR */}
      <div className="hidden md:flex h-full shrink-0 z-10 relative">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1, marginLeft: '0' }}>
        
        <Header />
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* MAIN SCROLLABLE CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="max-w-[1600px] mx-auto w-full pt-4">
          
          {/* TOP HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 fade-up">
            <div>
              <h1 className="text-[28px] md:text-[32px] font-bold text-white mb-2">Academic Resources</h1>
              <p className="text-white/50 text-[15px]">Study materials shared by students</p>
            </div>
            <button 
              onClick={() => navigate('/resources/upload')}
              className="px-6 h-[44px] rounded-[12px] flex items-center justify-center text-white font-bold transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' }}
            >
              + Upload Resource
            </button>
          </div>

          {/* POPULAR BAR */}
          {popular.length > 0 && (
            <div className="mb-12 fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-4">
                <h2 className="text-[20px] font-bold text-white flex items-center gap-2"> Popular Resources</h2>
                <p className="text-white/50 text-sm">Most viewed this week</p>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar snap-x">
                {popular.map(res => (
                  <div key={`pop-${res._id}`} className="min-w-[300px] w-[300px] snap-start">
                    <ResourceCard 
                      resource={res}
                      isBookmarked={bookmarks.includes(res._id)}
                      onBookmark={handleBookmark}
                      onDownload={handleDownload}
                      showActions={res.uploadedBy?._id === currentUser?._id || currentUser?.role === 'admin'}
                      onEdit={() => openEdit(res)}
                      onDelete={() => setShowConfirmModal(res._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* TOP RESOURCES SECTION */}
          {topResources.length > 0 && (
            <div className="mb-12 fade-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="text-amber-400 w-7 h-7" />
                <h2 className="text-2xl font-bold text-white">Top Resources</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {topResources.map((res) => (
                  <div 
                    key={`top-${res._id}`} 
                    className="rounded-xl border-2 border-amber-400 bg-amber-50 shadow-md p-4 transition-transform hover:scale-[1.02] flex flex-col h-full"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="text-amber-400 w-5 h-5 shrink-0" />
                      <h3 className="font-bold text-gray-900 line-clamp-1">{res.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">{res.subject}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Year {res.year}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Sem {res.semester}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{res.viewCount}</span>
                      <span className="flex items-center gap-1"><Download className="w-3 h-3" />{res.downloadCount}</span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => handleView(res)} 
                        className="flex-1 py-2 text-xs border border-amber-400 text-amber-600 rounded-lg hover:bg-amber-50"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDownload(res)} 
                        className="flex-1 py-2 text-xs bg-amber-400 text-white rounded-lg hover:bg-amber-500"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILTERS */}
          <div 
            className="mb-8 p-5 fade-up"
            style={{ 
              animationDelay: '0.2s',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px'
            }}
          >
            {/* Search */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"></span>
              <input 
                type="text"
                placeholder="Search by title or subject..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-[15px] pl-11 focus:border-[#00c2cb]/50 transition-colors"
                style={inputStyle}
              />
            </div>
            {/* Dropdowns */}
            <div className="flex flex-wrap items-center gap-4">
              <select name="year" value={filters.year} onChange={handleFilterChange} style={inputStyle} className="min-w-[140px] appearance-none cursor-pointer hover:bg-white/5 bg-[#0a1019]">
                <option value="">All Years</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
              <select name="semester" value={filters.semester} onChange={handleFilterChange} style={inputStyle} className="min-w-[140px] appearance-none cursor-pointer hover:bg-white/5 bg-[#0a1019]">
                <option value="">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
              <select name="fileType" value={filters.fileType} onChange={handleFilterChange} style={inputStyle} className="min-w-[140px] appearance-none cursor-pointer hover:bg-white/5 bg-[#0a1019]">
                <option value="">All Types</option>
                <option value="pdf">PDF Only</option>
                <option value="video">Video Only</option>
              </select>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} style={inputStyle} className="min-w-[150px] appearance-none cursor-pointer hover:bg-white/5 bg-[#0a1019]">
                <option value="createdAt">Latest Uploads</option>
                <option value="viewCount">Most Viewed</option>
                <option value="downloadCount">Most Downloaded</option>
              </select>
              
              <button 
                onClick={handleClearFilters}
                className="text-sm font-medium text-white/40 hover:text-white ml-auto px-4"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* RESULTS META */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/50 text-sm">Showing {pagination.total} resource{pagination.total !== 1 && 's'}</p>
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${viewMode==='grid'?'bg-[#00c2cb] text-[#080d14]':'text-white/50 hover:text-white'}`}>⊞ Grid</button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${viewMode==='list'?'bg-[#00c2cb] text-[#080d14]':'text-white/50 hover:text-white'}`}>≡ List</button>
            </div>
          </div>

          {/* MAIN GRID */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={`skel-${i}`} className="h-[240px] rounded-[16px] animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}></div>
              ))}
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {resources.map((res) => (
                <div key={res._id} className="fade-up">
                  <ResourceCard 
                    resource={res}
                    isBookmarked={bookmarks.includes(res._id)}
                    onBookmark={handleBookmark}
                    onDownload={handleDownload}
                    showActions={res.uploadedBy?._id === currentUser?._id || currentUser?.role === 'admin'}
                    onEdit={() => openEdit(res)}
                    onDelete={() => setShowConfirmModal(res._id)}
                  />
                </div>
              ))}
            </div>
          ) : (
             <div className="w-full h-[300px] flex flex-col items-center justify-center rounded-[16px] border border-white/10 mt-10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-5xl mb-4 opacity-50"></span>
                <h3 className="text-xl font-bold text-white mb-2">No resources found</h3>
                <p className="text-white/50 mb-6 text-center max-w-sm">Try different filters or be the first to upload a resource for these settings!</p>
                <button 
                  onClick={() => navigate('/resources/upload')}
                  className="px-6 h-[44px] rounded-[12px] flex items-center justify-center text-white font-bold"
                  style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' }}
                >
                  + Upload Resource
                </button>
             </div>
          )}

          {/* PAGINATION */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 mb-20 fade-up">
              <button 
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                ←
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={`page-${i}`}
                  onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                  style={{ 
                    background: pagination.page === (i + 1) ? '#00c2cb' : 'transparent',
                    color: pagination.page === (i + 1) ? '#080d14' : 'rgba(255,255,255,0.6)',
                    border: pagination.page === (i + 1) ? 'none' : '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                →
              </button>
            </div>
          )}

        </div>
      
        <Footer />
        </main>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4" style={{ background: 'rgba(8, 13, 20, 0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-[400px] p-6 rounded-[20px] fade-up" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <span className="text-red-500 text-xl">️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Resource?</h3>
            <p className="text-white/60 text-[14px] mb-8">This action cannot be undone. The file and all its data will be permanently removed.</p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 h-[44px] rounded-[10px] text-white font-bold hover:bg-white/5 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 h-[44px] bg-red-500/90 hover:bg-red-500 rounded-[10px] text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingResource && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4" style={{ background: 'rgba(8,13,20,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-[480px] p-7 rounded-[20px] fade-up" style={{ background: '#0d1a26', border: '1px solid rgba(0,194,203,0.2)' }}>
            <h3 className="text-xl font-bold text-white mb-6">Edit Resource</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Title *', key: 'title', placeholder: 'Resource title (5–100 chars)', maxLen: 100 },
                { label: 'Subject *', key: 'subject', placeholder: 'e.g. Software Engineering', maxLen: 80 },
                { label: 'Module Code', key: 'moduleCode', placeholder: 'e.g. IT2040', maxLen: 10 },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-white/70 text-sm mb-1 block">{field.label}</label>
                  <input
                    value={editForm[field.key]}
                    onChange={e => setEditForm(prev => ({ ...prev, [field.key]: field.key === 'moduleCode' ? e.target.value.toUpperCase() : e.target.value }))}
                    maxLength={field.maxLen}
                    placeholder={field.placeholder}
                    className="w-full rounded-[10px] px-4 py-3 text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: editErrors[field.key] ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                  />
                  {editErrors[field.key] && <p className="text-red-400 text-xs mt-1">{editErrors[field.key]}</p>}
                </div>
              ))}
              <div>
                <label className="text-white/70 text-sm mb-1 block">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-[10px] px-4 py-3 text-white text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setEditingResource(null)}
                className="flex-1 h-[42px] rounded-[10px] font-bold text-white/70 hover:bg-white/5 transition-colors" 
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSave}
                className="flex-1 h-[42px] rounded-[10px] font-bold text-white transition-opacity hover:opacity-90" 
                style={{ background: 'linear-gradient(90deg,#00c2cb,#7c3aed)' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
