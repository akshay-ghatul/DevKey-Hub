import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { VALIDATION } from '../../utils/constants';

export default function EditApiKeyModal({ isOpen, onClose, onSubmit, apiKey }) {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (apiKey) {
      setFormData({
        name: apiKey.name || ''
      });
    }
  }, [apiKey]);

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    
    onSubmit({
      name: formData.name.trim()
    });
  };

  const handleClose = () => {
    setFormData({ name: '' });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit API Key"
      size="md"
    >
      <div>
        <p className="text-sm text-gray-600 mb-6">
          Update the name for this API key.
        </p>
        
        <div className="space-y-6">
          {/* Key Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
              placeholder="Key Name"
              maxLength={VALIDATION.MAX_NAME_LENGTH}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
} 