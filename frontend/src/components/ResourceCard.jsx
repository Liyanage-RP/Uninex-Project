import React from 'react';
import { formatDistanceToNow } from 'date-fns';

// SVG icon components — no emoji
const PdfIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

export default function ResourceCard({
  resource,
  onBookmark,
  onDownload,
  isBookmarked,
  showActions,
  onEdit,
  onDelete
}) {
  const {
    _id,
    title,
    subject,
    moduleCode,
    fileType,
    year,
    semester,
    uploadedBy,
    viewCount,
    downloadCount,
    createdAt
  } = resource;

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const initials = uploadedBy?.name ? uploadedBy.name.substring(0, 2).toUpperCase() : 'UN';
  const isPdf = fileType === 'pdf';

  return (
    <div
      className="group w-full flex flex-col p-5 transition-all duration-300 cursor-pointer overflow-hidden relative"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,194,203,0.3)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,194,203,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* --- TOP ROW --- */}
      <div className="flex justify-between items-start mb-4">
        {/* File Type Icon */}
        <div
          className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center shrink-0 text-white"
          style={{
            background: isPdf
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
          }}
        >
          {isPdf ? <PdfIcon /> : <VideoIcon />}
        </div>

        {/* Year / Semester Badges */}
        <div className="flex flex-col gap-2 items-end">
          <div className="px-[10px] py-[4px] rounded-full text-[11px] font-bold text-white"
               style={{ background: 'rgba(0,194,203,0.15)', border: '1px solid rgba(0,194,203,0.3)' }}>
            Y{year}
          </div>
          <div className="px-[10px] py-[4px] rounded-full text-[11px] font-bold text-white"
               style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
            S{semester}
          </div>
        </div>
      </div>

      {/* --- MIDDLE --- */}
      <div className="flex-1">
        {moduleCode && (
          <p className="text-[12px] text-[#00c2cb] font-bold mb-1">{moduleCode}</p>
        )}
        <h3 className="text-white text-[15px] font-semibold leading-snug mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-white/50 text-[14px] mb-3 line-clamp-1">{subject}</p>

        {/* Uploader */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#00c2cb] text-[#080d14] text-[10px] font-bold shrink-0">
            {initials}
          </div>
          <span className="text-white/50 text-[12px]">by {uploadedBy?.name || 'Unknown'}</span>
          <span className="text-white/30 text-[12px]">· {timeAgo}</span>
        </div>
      </div>

      {/* --- STATS ROW --- */}
      <div className="flex items-center gap-4 mb-3 border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5 text-white/50">
          <span className="text-[#00c2cb]"><EyeIcon /></span>
          <span className="text-white text-[13px] font-semibold">{viewCount}</span>
          <span className="text-[12px]">views</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/50">
          <span className="text-[#00c2cb]"><DownloadIcon /></span>
          <span className="text-white text-[13px] font-semibold">{downloadCount}</span>
          <span className="text-[12px]">downloads</span>
        </div>
      </div>

      {/* --- ACTIONS ROW --- */}
      <div className="flex items-center gap-2 mt-auto">
        {/* Primary button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(_id); }}
          className="flex-1 h-[36px] rounded-[10px] flex items-center justify-center gap-1.5 text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(90deg, #00c2cb, #7c3aed)' }}
        >
          {isPdf
            ? <><DownloadIcon /> Download</>
            : <><PlayIcon /> Watch</>
          }
        </button>

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); onBookmark(_id); }}
          className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center transition-all"
          title={isBookmarked ? 'Remove bookmark' : 'Save bookmark'}
          style={{
            background: isBookmarked ? 'rgba(0,194,203,0.2)' : 'rgba(255,255,255,0.05)',
            border: isBookmarked ? '1px solid #00c2cb' : '1px solid rgba(255,255,255,0.1)',
            color: isBookmarked ? '#00c2cb' : 'rgba(255,255,255,0.4)'
          }}
        >
          <BookmarkIcon filled={isBookmarked} />
        </button>

        {/* Edit / Delete (owner or admin) */}
        {showActions && (
          <div className="flex items-center gap-1.5 ml-1 border-l border-white/10 pl-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              title="Edit resource"
              className="w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
            >
              <EditIcon />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              title="Delete resource"
              className="w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors text-red-400 hover:text-white hover:bg-red-500/20 border border-white/10 hover:border-red-500/40"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
