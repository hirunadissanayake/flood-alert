import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: 'user' | 'admin';
  isSafe: boolean;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: string;
}

function AdminUsers() {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'admin' | 'user' | 'safe' | 'unsafe'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/auth/users');
      setUsers(response.data.data);
    } catch (error: any) {
      setAlert({ type: 'error', message: 'Failed to load users' });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });
      setAlert({ type: 'success', message: `User role updated to ${newRole}` });
      setTimeout(() => setAlert(null), 3000);
      fetchUsers();
    } catch (error: any) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to update role' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/auth/users/${userId}`);
      setAlert({ type: 'success', message: 'User deleted successfully' });
      setTimeout(() => setAlert(null), 3000);
      fetchUsers();
    } catch (error: any) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to delete user' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'admin') return user.role === 'admin';
    if (filter === 'user') return user.role === 'user';
    if (filter === 'safe') return user.isSafe === true;
    if (filter === 'unsafe') return user.isSafe === false;
    return true;
  });

  return (
    <Layout>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
            <p className="text-indigo-100">Manage user accounts, roles, and safety status</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl">
            <div className="text-white text-sm font-medium">Total Users</div>
            <div className="text-white text-3xl font-bold">{users.length}</div>
          </div>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2 mb-6 inline-flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All ({users.length})
        </button>
        <button
          onClick={() => setFilter('admin')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'admin'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Admins ({users.filter(u => u.role === 'admin').length})
        </button>
        <button
          onClick={() => setFilter('user')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'user'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Regular Users ({users.filter(u => u.role === 'user').length})
        </button>
        <button
          onClick={() => setFilter('safe')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'safe'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Safe ({users.filter(u => u.isSafe).length})
        </button>
        <button
          onClick={() => setFilter('unsafe')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'unsafe'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Needs Help ({users.filter(u => !u.isSafe).length})
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 p-6 rounded-full">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">No users match the selected filter</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header with gradient based on role */}
                <div className={`p-6 ${user.role === 'admin' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-white/30 text-white' : 'bg-white/30 text-white'}`}>
                        {user.role.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isSafe ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {user.isSafe ? 'SAFE' : 'NEEDS HELP'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
                  <p className="text-white/80 text-sm">{user.email}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    {user.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}
                    {user.location?.address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-2">{user.location.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {user._id !== currentUser?._id && (
                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleChangeRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Change to {user.role === 'admin' ? 'User' : 'Admin'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-2.5 px-4 rounded-xl hover:from-red-700 hover:to-rose-700 transition font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete User
                      </button>
                    </div>
                  )}
                  {user._id === currentUser?._id && (
                    <div className="pt-4 border-t border-gray-100 text-center">
                      <p className="text-sm text-gray-500 italic">This is your account</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Layout>
  );
}

export default AdminUsers;
