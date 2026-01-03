import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { createReport } from '../../redux/slices/reportSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import GoogleMapPicker from '../common/GoogleMapPicker';

interface ReportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

function ReportForm({ onSuccess, onCancel }: ReportFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    location: { lat: 0, lng: 0, address: '' },
    waterLevel: 'low' as 'low' | 'medium' | 'high' | 'severe',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createReport({ ...formData, imageFile })).unwrap();
      onSuccess?.();
      // Reset form
      setFormData({
        location: { lat: 0, lng: 0, address: '' },
        waterLevel: 'low',
        description: '',
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Failed to create report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          Water Level
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={formData.waterLevel}
          onChange={(e) =>
            setFormData({
              ...formData,
              waterLevel: e.target.value as 'low' | 'medium' | 'high' | 'severe',
            })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="severe">Severe</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <div className="mt-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-48 rounded-lg border border-gray-300"
            />
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
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

export default ReportForm;
