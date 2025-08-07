import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { API_CONFIG, VALIDATION } from '../../utils/constants';

export default function CreateApiKeyModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    limitUsage: false,
    monthlyLimit: API_CONFIG.DEFAULT_MONTHLY_LIMIT
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    
    onSubmit({
      name: formData.name.trim(),
      limitUsage: formData.limitUsage,
      monthlyLimit: formData.monthlyLimit
    });
    
    // Reset form
    setFormData({
      name: '',
      limitUsage: false,
      monthlyLimit: API_CONFIG.DEFAULT_MONTHLY_LIMIT
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      limitUsage: false,
      monthlyLimit: API_CONFIG.DEFAULT_MONTHLY_LIMIT
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create a new API key"
      size="md"
    >
      <div>
        <p className="text-sm text-gray-600 mb-6">
          Enter a name and limit for the new API key.
        </p>
        
        <div className="space-y-6">
          {/* Key Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Name - A unique name to identify this key
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

          {/* Monthly Usage Limit */}
          <div>
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={formData.limitUsage}
                onChange={(e) => setFormData({...formData, limitUsage: e.target.checked})}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Limit monthly usage*</span>
            </label>
            {formData.limitUsage && (
              <div>
                <input
                  type="number"
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({...formData, monthlyLimit: parseInt(e.target.value) || 0})}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                  min={VALIDATION.MIN_MONTHLY_LIMIT}
                />
                <p className="mt-1 text-xs text-gray-500">
                  * If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
                </p>
              </div>
            )}
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
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
} 