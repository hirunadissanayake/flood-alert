import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import GoogleMapPicker from '../components/common/GoogleMapPicker';
import api from '../services/api';
import { toast } from 'react-toastify';

function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Location State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [location, setLocation] = useState({
    lat: user?.location?.lat || 0,
    lng: user?.location?.lng || 0,
    address: user?.location?.address || ''
  });
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Safety Status State
  const [isUpdatingSafety, setIsUpdatingSafety] = useState(false);

  // Handle Edit Profile
  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const response = await api.put('/auth/profile', editFormData);
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditModalOpen(false);
        window.location.reload(); // Reload to get updated user data
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.data.success) {
        toast.success('Password changed successfully');
        setIsPasswordModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle Update Location
  const handleUpdateLocation = async () => {
    setIsUpdatingLocation(true);
    try {
      const response = await api.put('/auth/profile', { location });
      if (response.data.success) {
        toast.success('Location updated successfully');
        setIsLocationModalOpen(false);
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update location');
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  // Handle Safety Status
  const handleToggleSafety = async () => {
    setIsUpdatingSafety(true);
    try {
      const response = await api.put('/auth/mark-safe', { isSafe: !user?.isSafe });
      if (response.data.success) {
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update safety status');
    } finally {
      setIsUpdatingSafety(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await api.delete('/auth/account', { data: { password: deletePassword } });
      if (response.data.success) {
        toast.success('Account deleted successfully');
        dispatch(logout());
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">My Profile</h2>
        <p className="text-blue-100 text-sm sm:text-base md:text-lg">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <svg className="w-32 h-32 sm:w-40 sm:h-40" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 relative z-10">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl sm:text-4xl font-bold border-4 border-white/30 shadow-xl mx-auto sm:mx-0">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user?.name}</h3>
                <p className="text-purple-100 text-base sm:text-lg mb-3 break-all">{user?.email}</p>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                  <span
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md bg-white/20 border-2 border-white/30 ${
                      user?.role === 'admin' ? 'text-yellow-100' : 'text-white'
                    }`}
                  >
                    {user?.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
                  </span>
                  <span
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md border-2 ${
                      user?.isSafe
                        ? 'bg-green-500/80 border-green-300 text-white'
                        : 'bg-red-500/80 border-red-300 text-white'
                    }`}
                  >
                    {user?.isSafe ? '✓ Safe' : '⚠ Needs Help'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-4 sm:p-6 md:p-8">
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase">Phone Number</p>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base md:text-lg break-all">{user?.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase">Email Address</p>
                  <p className="text-gray-900 font-semibold text-sm sm:text-base md:text-lg break-all">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          {user?.location && (
            <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 border-t border-gray-100 pt-4 sm:pt-6 md:pt-8">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </h4>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4 border border-blue-100">
                <p className="text-gray-900 font-medium mb-2 text-sm sm:text-base break-words">{user.location.address}</p>
                <p className="text-xs sm:text-sm text-gray-600 break-all">
                  📍 Coordinates: {user.location.lat.toFixed(6)}, {user.location.lng.toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions Card */}
        <div className="space-y-4 sm:space-y-6">
          {/* Safety Status Card */}
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Safety Status
            </h4>
            <div className={`p-3 sm:p-4 rounded-xl mb-4 ${user?.isSafe ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-xs sm:text-sm font-semibold ${user?.isSafe ? 'text-green-700' : 'text-red-700'}`}>
                {user?.isSafe ? 'You are marked as safe' : 'You need assistance'}
              </p>
            </div>
            <Button
              variant={user?.isSafe ? 'danger' : 'success'}
              fullWidth
              onClick={handleToggleSafety}
              disabled={isUpdatingSafety}
            >
              {isUpdatingSafety ? 'Updating...' : user?.isSafe ? 'Mark as Needs Help' : 'Mark as Safe'}
            </Button>
          </div>

          {/* Account Actions Card */}
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account Actions
            </h4>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => {
                  setEditFormData({ name: user?.name || '', phoneNumber: user?.phoneNumber || '' });
                  setIsEditModalOpen(true);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
              
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition font-semibold flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Change Password
              </button>
              
              <button
                onClick={() => {
                  setLocation({
                    lat: user?.location?.lat || 0,
                    lng: user?.location?.lng || 0,
                    address: user?.location?.address || ''
                  });
                  setIsLocationModalOpen(true);
                }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition font-semibold flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Update Location
              </button>
              
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 sm:py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 transition font-semibold flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            placeholder="Enter your full name"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={editFormData.phoneNumber}
            onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
            placeholder="+94771234567"
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              fullWidth
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            placeholder="Enter new password (min 6 characters)"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              fullWidth
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Location Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Update Your Location"
      >
        <div className="space-y-4">
          <GoogleMapPicker
            location={location}
            onChange={(newLocation) => setLocation(newLocation)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              fullWidth
              onClick={handleUpdateLocation}
              disabled={isUpdatingLocation}
            >
              {isUpdatingLocation ? 'Updating...' : 'Update Location'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsLocationModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-red-800 mb-1">Warning: This action cannot be undone!</p>
                <p className="text-sm text-red-700">All your data including reports, SOS requests, and account information will be permanently deleted.</p>
              </div>
            </div>
          </div>
          <Input
            label="Enter your password to confirm"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Your password"
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="danger"
              fullWidth
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletePassword('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

export default Profile;
