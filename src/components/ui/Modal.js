import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-96',
    md: 'w-[500px]',
    lg: 'w-[600px]',
    xl: 'w-[800px]'
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-30 z-40 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`relative p-6 border shadow-lg rounded-lg bg-white z-50 ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4">
            <h3 id="modal-title" className="text-xl font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        {children}
      </div>
    </div>
  );
} 