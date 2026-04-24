import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import ResourceCard from '../../components/ResourceCard';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function MyBookmarks() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'viewed', 'year'

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/bookmarks');
      const validBookmarks = data.data
        .map(b => b.resourceId)
        .filter(res => res !== null);
      setBookmarks(validBookmarks); // Extracted populated resource logic
    } catch (err) {
      addToast('Failed to load bookmarks', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemoveBookmark = async (resourceId) => {
    try {
      await axiosInstance.delete(`/bookmarks/${resourceId}`);
      setBookmarks(prev => prev.filter(r => r._id !== resourceId));
      addToast('Removed from bookmarks', 'info');
    } catch (err) {
      addToast('Failed to remove bookmark', 'error');
    }
  };

  const handleDownload = async (resourceId) => {
    try {
      const { data } = await axiosInstance.put(`/resources/${resourceId}/download`);
      const res = data.data;
      const targetUrl = res.fileType === 'pdf' ? `http://localhost:5000${res.fileUrl}` : res.videoUrl;
      window.open(targetUrl, '_blank');

      // Update local downloadCount only (viewCount is tracked server-side via GET /:id)
      setBookmarks(prev => prev.map(r => r._id === resourceId ? { ...r, downloadCount: r.downloadCount + 1 } : r));
    } catch (err) {
      addToast('Failed to access resource', 'error');
    }
  };

  // Sorting logic
  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'viewed') return b.viewCount - a.viewCount;
    if (sortBy === 'year') return b.year - a.year;
    return 0;
  });

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
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 fade-up">
            <div>
              <h1 className="text-[28px] md:text-[32px] font-bold text-white mb-2">My Saved Resources</h1>
              <p className="text-white/50 text-[15px]">Your personal study library</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="px-4 h-[36px] bg-cyan-500/10 text-[#00c2cb] border border-cyan-500/20 rounded-full font-bold flex items-center justify-center shadow-[0_0_15px_rgba(0,194,203,0.1)]">
                {bookmarks.length} saved
              </span>
            </div>
          </div>

          {!loading && bookmarks.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-sm text-white/40 font-medium">Sort by:</span>
              <div className="flex bg-white/5 rounded-[12px] p-1 border border-white/10 w-fit">
                <button onClick={() => setSortBy('recent')} className={`px-4 py-2 text-xs rounded-[8px] font-bold transition-all ${sortBy==='recent'?'bg-[#0a1019] text-white shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/10':'text-white/50 hover:text-white'}`}>Recently Saved</button>
                <button onClick={() => setSortBy('viewed')} className={`px-4 py-2 text-xs rounded-[8px] font-bold transition-all ${sortBy==='viewed'?'bg-[#0a1019] text-white shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/10':'text-white/50 hover:text-white'}`}>Most Viewed</button>
                <button onClick={() => setSortBy('year')} className={`px-4 py-2 text-xs rounded-[8px] font-bold transition-all ${sortBy==='year'?'bg-[#0a1019] text-white shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/10':'text-white/50 hover:text-white'}`}>By Year</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={`skel-${i}`} className="h-[240px] rounded-[16px] animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}></div>
              ))}
            </div>
          ) : bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sortedBookmarks.map((res, index) => (
                <div key={res._id} className="fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ResourceCard 
                    resource={res}
                    isBookmarked={true}
                    onBookmark={handleRemoveBookmark}
                    onDownload={handleDownload}
                    showActions={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="w-full h-[400px] flex flex-col items-center justify-center rounded-[24px] border border-white/10 mt-10 fade-up" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}>
              <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center mb-6">
                <span className="text-4xl opacity-50 text-[#00c2cb]"></span>
              </div>
              <h3 className="text-[22px] font-bold text-white mb-2">No saved resources yet</h3>
              <p className="text-white/50 mb-8 text-center max-w-[340px] text-sm leading-relaxed">
                Browse through academic resources and bookmark the ones you want to revisit before exams.
              </p>
              <button 
                onClick={() => navigate('/resources')}
                className="px-8 h-[48px] rounded-[12px] flex items-center justify-center text-white font-bold transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)', boxShadow: '0 10px 30px rgba(124,58,237,0.3)' }}
              >
                Browse Resources →
              </button>
            </div>
          )}

        </div>

        <Footer />
        </main>
      </div>
    </div>
  );
}
