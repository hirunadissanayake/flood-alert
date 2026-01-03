import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { createSOSRequest } from '../../redux/slices/sosSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import GoogleMapPicker from '../common/GoogleMapPicker';

interface SOSFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function SOSForm({ onSuccess, onCancel }: SOSFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    type: 'rescue' as 'rescue' | 'food' | 'medicine' | 'evacuation',
    location: { lat: 0, lng: 0, address: '' },
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createSOSRequest(formData)).unwrap();
      onSuccess?.();
      setFormData({
        type: 'rescue',
        location: { lat: 0, lng: 0, address: '' },
        description: '',
      });
    } catch (error) {
      console.error('Failed to create SOS request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Request Type
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as 'rescue' | 'food' | 'medicine' | 'evacuation',
            })
          }
        >
          <option value="rescue">Rescue</option>
          <option value="food">Food</option>
          <option value="medicine">Medicine</option>
          <option value="evacuation">Evacuation</option>
        </select>
      </div>

      <GoogleMapPicker
        location={formData.location}
        onChange={(location) => setFormData({ ...formData, location })}
      />

      <Input
        label="Address"
        type="text"
        required
        value={formData.location.address || ''}
        readOnly
        placeholder="Click on map to select location"
        className="bg-gray-50"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Latitude"
          type="number"
          step="any"
          required
          value={formData.location.lat || ''}
          readOnly
          placeholder="Auto-filled from map"
          className="bg-gray-50"
        />
        <Input
          label="Longitude"
          type="number"
          step="any"
          required
          value={formData.location.lng || ''}
          readOnly
          placeholder="Auto-filled from map"
          className="bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Details (Optional)
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex space-x-3">
        <Button type="submit" variant="danger" fullWidth disabled={loading}>
          {loading ? 'Sending...' : 'Submit SOS Request'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default SOSForm;
