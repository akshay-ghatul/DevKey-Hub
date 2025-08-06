import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, keyName }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      <div>
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-medium text-red-900">Delete API Key</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete the API key "<strong>{keyName}</strong>"? 
          This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
} 