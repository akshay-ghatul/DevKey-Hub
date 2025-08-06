import { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, onClose]);

  if (!toast.show) return null;

  const getIcon = () => {
    if (toast.type === 'error' || toast.type === 'delete') {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-60 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
      toast.type === 'error' || toast.type === 'delete' ? 'bg-red-600' : 'bg-green-500'
    }`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <span className="ml-2 font-medium">{toast.message}</span>
        <button 
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-white hover:text-gray-200 transition-colors"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
} 