import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 px-5 py-4 rounded-[12px] min-w-[280px] pointer-events-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              border: toast.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' 
                    : toast.type === 'error' ? '1px solid rgba(239, 68, 68, 0.3)' 
                    : '1px solid rgba(0, 194, 203, 0.3)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              animation: 'slideInRight 0.3s ease-out forwards'
            }}
          >
            {/* Icons based on type */}
            {toast.type === 'success' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500 text-lg"></div>
            )}
            {toast.type === 'error' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 text-lg"></div>
            )}
            {toast.type === 'info' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-cyan-500/10 text-cyan-500 text-lg text-emerald-500">ℹ</div>
            )}
            
            <p className="text-white text-[14px] font-medium flex-1 pr-4">{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
