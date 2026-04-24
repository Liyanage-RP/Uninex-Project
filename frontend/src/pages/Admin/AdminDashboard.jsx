import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const StatCard = ({ label, value, color, sub }) => (
  <div className="rounded-[20px] p-6 flex flex-col gap-3 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200"
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full blur-[50px] opacity-20 group-hover:opacity-30 transition-opacity" style={{ background: color }} />
    <div className="text-[42px] font-black" style={{ color }}>{value ?? '—'}</div>
    <div className="text-white font-semibold text-[15px]">{label}</div>
    {sub && <div className="text-white/40 text-xs">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [resources, setResources] = useState([]);
  const [totalResources, setTotalResources] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', subject: '', moduleCode: '', description: '' });
  const [editErrors, setEditErrors] = useState({});
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'resources' | 'users'

  useEffect(() => {
    axiosInstance.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => addToast('Failed to load stats', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const fetchResources = async (p = 1) => {
    setTableLoading(true);
    try {
      const { data } = await axiosInstance.get(`/resources?page=${p}&limit=8`);
      setResources(data.data);
      setTotalResources(data.pagination.total);
      setTotalPages(data.pagination.pages);
      setPage(p);
    } catch {
      addToast('Failed to load resources', 'error');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => { fetchResources(1); }, []);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/resources/${confirmDeleteId}`);
      setResources(prev => prev.filter(r => r._id !== confirmDeleteId));
      setTotalResources(prev => prev - 1);
      if (stats) setStats(prev => ({ ...prev, totalResources: prev.totalResources - 1 }));
      addToast('Resource deleted', 'success');
      setConfirmDeleteId(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.title || editForm.title.trim().length < 5) errs.title = 'Min 5 characters';
    if (!editForm.subject || editForm.subject.trim().length < 3) errs.subject = 'Min 3 characters';
    if (editForm.moduleCode && !/^[A-Za-z]{2,4}[0-9]{3,4}$/.test(editForm.moduleCode)) errs.moduleCode = 'Format: IT2040';
    return errs;
  };

  const handleEditSave = async () => {
    const errs = validateEdit();
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }
    try {
      await axiosInstance.put(`/resources/${editingResource._id}`, editForm);
      setResources(prev => prev.map(r => r._id === editingResource._id ? { ...r, ...editForm } : r));
      addToast('Resource updated', 'success');
      setEditingResource(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const inputCls = (err) => ({
    background: 'rgba(255,255,255,0.05)',
    border: err ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '10px 14px', color: 'white', outline: 'none', width: '100%'
  });

  return (
    <div className="flex h-screen bg-[#080d14] font-['Inter'] text-white overflow-hidden">
      <div className="hidden md:flex h-full shrink-0 z-10 relative">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1 }}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="max-w-[1400px] mx-auto w-full">

            {/* ── HERO HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 fade-up">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black text-white" style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>A</div>
                  <span className="text-white/50 text-sm font-medium uppercase tracking-widest">Administrator</span>
                </div>
                <h1 className="text-[36px] md:text-[44px] font-black tracking-tight leading-none text-white">
                  Welcome back, <span style={{ background: 'linear-gradient(90deg,#ef4444,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0] || 'Admin'}</span>
                </h1>
                <p className="text-white/40 text-[15px] mt-2">Here's what's happening on the UniNexus platform today.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-4 py-2 rounded-full text-xs font-bold tracking-widest text-[#ef4444]" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  SYSTEM ADMIN
                </div>
                <div className="text-white/30 text-sm">{new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}</div>
              </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8 fade-up" style={{ animationDelay: '0.1s' }}>
              <StatCard label="Total Students" value={loading ? '...' : stats?.totalUsers} color="#00c2cb" sub="Registered accounts" />
              <StatCard label="Total Resources" value={loading ? '...' : stats?.totalResources} color="#7c3aed" sub="PDF + Video uploads" />
              <StatCard label="PDF Files" value={loading ? '...' : stats?.pdfCount} color="#ef4444" sub="Uploaded documents" />
              <StatCard label="Video Links" value={loading ? '...' : stats?.videoCount} color="#3b82f6" sub="Linked videos" />
              <StatCard label="Total Views" value={loading ? '...' : stats?.totalViews} color="#10b981" sub="Across all resources" />
              <StatCard label="Downloads" value={loading ? '...' : stats?.totalDownloads} color="#f59e0b" sub="Resource downloads" />
            </div>

            {/* ── TABS ── */}
            <div className="flex items-center gap-1 mb-6 p-1 rounded-[14px] w-fit" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {[['overview','Overview'], ['resources','Resources'], ['users','Recent Users']].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className="px-5 py-2 rounded-[10px] text-sm font-semibold transition-all duration-200"
                  style={{ background: activeTab === key ? 'rgba(239,68,68,0.15)' : 'transparent', color: activeTab === key ? '#ef4444' : 'rgba(255,255,255,0.4)', border: activeTab === key ? '1px solid rgba(239,68,68,0.25)' : '1px solid transparent' }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-up">
                {/* Recent Uploads */}
                <div className="rounded-[20px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h3 className="font-bold text-white">Recent Uploads</h3>
                    <button onClick={() => setActiveTab('resources')} className="text-xs text-[#00c2cb] hover:underline">View all</button>
                  </div>
                  {loading ? <div className="p-8 text-center text-white/30 text-sm">Loading...</div> : (
                    <div className="divide-y divide-white/[0.04]">
                      {(stats?.recentResources || []).map(r => (
                        <div key={r._id} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: r.fileType === 'pdf' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)', color: r.fileType === 'pdf' ? '#ef4444' : '#3b82f6', border: `1px solid ${r.fileType === 'pdf' ? 'rgba(239,68,68,0.25)' : 'rgba(59,130,246,0.25)'}` }}>
                            {r.fileType === 'pdf' ? 'PDF' : 'VID'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium truncate">{r.title}</div>
                            <div className="text-white/40 text-xs">{r.uploadedBy?.name || 'Unknown'} · {r.subject}</div>
                          </div>
                          <div className="text-white/30 text-xs shrink-0">{timeAgo(r.createdAt)}</div>
                        </div>
                      ))}
                      {(!stats?.recentResources?.length) && <div className="p-6 text-center text-white/30 text-sm">No recent uploads</div>}
                    </div>
                  )}
                </div>

                {/* Recent Users */}
                <div className="rounded-[20px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h3 className="font-bold text-white">New Students</h3>
                    <button onClick={() => setActiveTab('users')} className="text-xs text-[#00c2cb] hover:underline">View all</button>
                  </div>
                  {loading ? <div className="p-8 text-center text-white/30 text-sm">Loading...</div> : (
                    <div className="divide-y divide-white/[0.04]">
                      {(stats?.recentUsers || []).map(u => {
                        const initials = u.name?.substring(0,2).toUpperCase() || 'UN';
                        return (
                          <div key={u._id} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#00c2cb,#7c3aed)' }}>{initials}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-medium truncate">{u.name}</div>
                              <div className="text-white/40 text-xs">{u.studentId} · {u.faculty || 'Computing'}</div>
                            </div>
                            <div className="text-white/30 text-xs shrink-0">{timeAgo(u.createdAt)}</div>
                          </div>
                        );
                      })}
                      {(!stats?.recentUsers?.length) && <div className="p-6 text-center text-white/30 text-sm">No recent sign-ups</div>}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2 rounded-[20px] p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Manage Resources', desc: 'Edit, delete & moderate', color: '#00c2cb', action: () => setActiveTab('resources') },
                      { label: 'Review Users', desc: 'View registered students', color: '#7c3aed', action: () => setActiveTab('users') },
                      { label: 'Browse Platform', desc: 'View as regular user', color: '#10b981', action: () => navigate('/resources') },
                      { label: 'Admin Stats', desc: 'Reload live data', color: '#f59e0b', action: () => window.location.reload() },
                    ].map(a => (
                      <button key={a.label} onClick={a.action} className="text-left p-4 rounded-[14px] hover:opacity-90 transition-opacity"
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)` }}>
                        <div className="w-2 h-2 rounded-full mb-3" style={{ background: a.color }} />
                        <div className="text-white text-sm font-semibold mb-1">{a.label}</div>
                        <div className="text-white/40 text-xs">{a.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── RESOURCES TAB ── */}
            {activeTab === 'resources' && (
              <div className="rounded-[20px] overflow-hidden fade-up" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <h2 className="font-bold text-white">All Resources <span className="text-white/30 text-sm font-normal ml-2">({totalResources} total)</span></h2>
                  <button onClick={() => fetchResources(page)} className="text-xs text-[#00c2cb] hover:underline">Refresh</button>
                </div>
                {tableLoading ? (
                  <div className="p-12 text-center text-white/30">Loading...</div>
                ) : resources.length === 0 ? (
                  <div className="p-12 text-center text-white/30">No resources found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-white/30 text-xs uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <th className="text-left px-6 py-3">Title</th>
                          <th className="text-left px-4 py-3">Subject</th>
                          <th className="text-left px-4 py-3">Type</th>
                          <th className="text-left px-4 py-3">Year / Sem</th>
                          <th className="text-left px-4 py-3">Uploader</th>
                          <th className="text-right px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map((res, i) => (
                          <tr key={res._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                            <td className="px-6 py-4 max-w-[200px]">
                              <div className="text-white font-medium truncate">{res.title}</div>
                              {res.moduleCode && <div className="text-[#00c2cb] text-xs">{res.moduleCode}</div>}
                            </td>
                            <td className="px-4 py-4 text-white/50 max-w-[130px] truncate">{res.subject}</td>
                            <td className="px-4 py-4">
                              <span className="px-2 py-1 rounded-full text-xs font-bold" style={{
                                background: res.fileType === 'pdf' ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.12)',
                                color: res.fileType === 'pdf' ? '#ef4444' : '#3b82f6',
                                border: `1px solid ${res.fileType === 'pdf' ? 'rgba(239,68,68,0.25)' : 'rgba(59,130,246,0.25)'}`
                              }}>{res.fileType.toUpperCase()}</span>
                            </td>
                            <td className="px-4 py-4 text-white/40 text-sm">Y{res.year} / S{res.semester}</td>
                            <td className="px-4 py-4 text-white/40 text-xs truncate max-w-[120px]">{res.uploadedBy?.name || 'Unknown'}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => { setEditingResource(res); setEditForm({ title: res.title, subject: res.subject, moduleCode: res.moduleCode || '', description: res.description || '' }); setEditErrors({}); }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Edit</button>
                                <button onClick={() => setConfirmDeleteId(res._id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/20 transition-all" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-white/5">
                    <button disabled={page === 1} onClick={() => fetchResources(page - 1)} className="px-3 py-1 rounded text-sm disabled:opacity-30 hover:bg-white/5">← Prev</button>
                    <span className="text-white/30 text-sm">Page {page} / {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => fetchResources(page + 1)} className="px-3 py-1 rounded text-sm disabled:opacity-30 hover:bg-white/5">Next →</button>
                  </div>
                )}
              </div>
            )}

            {/* ── USERS TAB ── */}
            {activeTab === 'users' && (
              <div className="rounded-[20px] overflow-hidden fade-up" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-6 py-4 border-b border-white/5">
                  <h2 className="font-bold text-white">Recently Registered Students</h2>
                </div>
                {loading ? <div className="p-12 text-center text-white/30">Loading...</div> : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-white/30 text-xs uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th className="text-left px-6 py-3">Student</th>
                        <th className="text-left px-4 py-3">Email</th>
                        <th className="text-left px-4 py-3">Student ID</th>
                        <th className="text-left px-4 py-3">Faculty</th>
                        <th className="text-left px-4 py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats?.recentUsers || []).map((u, i) => {
                        const initials = u.name?.substring(0,2).toUpperCase() || 'UN';
                        return (
                          <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#00c2cb,#7c3aed)' }}>{initials}</div>
                                <span className="text-white font-medium">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-white/50">{u.email}</td>
                            <td className="px-4 py-4 text-[#00c2cb] font-mono text-xs">{u.studentId}</td>
                            <td className="px-4 py-4 text-white/40">{u.faculty || 'Faculty of Computing'}</td>
                            <td className="px-4 py-4 text-white/30 text-xs">{timeAgo(u.createdAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

          </div>
          <Footer />
        </main>
      </div>

      {/* DELETE CONFIRM */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4" style={{ background: 'rgba(8,13,20,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-[380px] p-7 rounded-[20px] fade-up" style={{ background: '#0d1a26', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-4 text-2xl text-red-500">[!]</div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Resource?</h3>
            <p className="text-white/50 text-sm mb-6">This is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 h-[42px] rounded-[10px] font-bold text-white/60 hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 h-[42px] rounded-[10px] font-bold text-white bg-red-500/80 hover:bg-red-500">Delete</button>
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
              {[{ label:'Title *', key:'title', ph:'Resource title (5–100 chars)', max:100 },
                { label:'Subject *', key:'subject', ph:'e.g. Software Engineering', max:80 },
                { label:'Module Code', key:'moduleCode', ph:'e.g. IT2040', max:10 }]
                .map(f => (
                  <div key={f.key}>
                    <label className="text-white/60 text-xs mb-1 block uppercase tracking-wider">{f.label}</label>
                    <input value={editForm[f.key]} maxLength={f.max} placeholder={f.ph}
                      onChange={e => setEditForm(p => ({ ...p, [f.key]: f.key==='moduleCode'?e.target.value.toUpperCase():e.target.value }))}
                      className="text-sm" style={inputCls(editErrors[f.key])} />
                    {editErrors[f.key] && <p className="text-red-400 text-xs mt-1">{editErrors[f.key]}</p>}
                  </div>
                ))}
              <div>
                <label className="text-white/60 text-xs mb-1 block uppercase tracking-wider">Description</label>
                <textarea value={editForm.description} maxLength={500} rows={3}
                  onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                  className="resize-none text-sm" style={inputCls(false)} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingResource(null)} className="flex-1 h-[42px] rounded-[10px] font-bold text-white/60 hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
              <button onClick={handleEditSave} className="flex-1 h-[42px] rounded-[10px] font-bold text-white hover:opacity-90" style={{ background: 'linear-gradient(90deg,#00c2cb,#7c3aed)' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
