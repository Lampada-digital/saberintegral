import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../stores';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[400px] ${
            toast.type === 'success' ? 'bg-green-50 border border-green-200' :
            toast.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
          <p className={`text-sm flex-1 ${
            toast.type === 'success' ? 'text-green-800' :
            toast.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          }`}>{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="shrink-0">
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      ))}
    </div>
  );
};
