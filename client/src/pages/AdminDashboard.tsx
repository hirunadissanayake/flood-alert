import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '@/services/api';

interface AdminStats {
  users: {
    total: number;
    admins: number;
    regular: number;
    safe: number;
    unsafe: number;
    newToday: number;
  };
  reports: {
    total: number;
    verified: number;
    pending: number;
    bySeverity: {
      low: number;
      medium: number;
      high: number;
      severe: number;
    };
    today: number;
    lastWeek: number;
    byDay: Array<{ _id: string; count: number }>;
  };
  sosRequests: {
    total: number;
    pending: number;
    accepted: number;
    completed: number;
    byType: {
      rescue: number;
      food: number;
      medicine: number;
      evacuation: number;
    };
    today: number;
    lastWeek: number;
  };
  shelters: {
    total: number;
    active: number;
    totalCapacity: number;
    totalOccupancy: number;
    availableSpace: number;
  };
}

function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'sos'>('overview');

  useEffect(() => {
    // Redirect non-admin users
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <Layout>
        <LoadingSpinner text="Loading admin dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-2">System-wide statistics and management</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'reports', label: 'Reports' },
              { id: 'sos', label: 'SOS Requests' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* User Statistics */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">User Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats.users.total}
                subtitle={`${stats.users.newToday} new today`}
                color="blue"
              />
              <StatCard
                title="Safe Users"
                value={stats.users.safe}
                subtitle={`${((stats.users.safe / stats.users.total) * 100).toFixed(1)}% of total`}
                color="green"
              />
              <StatCard
                title="Need Help"
                value={stats.users.unsafe}
                subtitle="Marked as unsafe"
                color="red"
              />
              <StatCard
                title="Admins"
                value={stats.users.admins}
                subtitle={`${stats.users.regular} regular users`}
                color="purple"
              />
            </div>
          </div>

          {/* Flood Report Statistics */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Flood Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Reports"
                value={stats.reports.total}
                subtitle={`${stats.reports.today} today`}
                color="blue"
              />
              <StatCard
                title="Pending Verification"
                value={stats.reports.pending}
                subtitle="Awaiting review"
                color="yellow"
              />
              <StatCard
                title="Verified"
                value={stats.reports.verified}
                subtitle={`${((stats.reports.verified / stats.reports.total) * 100).toFixed(1)}% of total`}
                color="green"
              />
              <StatCard
                title="Severe Alerts"
                value={stats.reports.bySeverity.severe}
                subtitle="High priority"
                color="red"
              />
            </div>
          </div>

          {/* SOS Request Statistics */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">SOS Requests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Requests"
                value={stats.sosRequests.total}
                subtitle={`${stats.sosRequests.today} today`}
                color="blue"
              />
              <StatCard
                title="Pending"
                value={stats.sosRequests.pending}
                subtitle="Awaiting response"
                color="red"
              />
              <StatCard
                title="In Progress"
                value={stats.sosRequests.accepted}
                subtitle="Being handled"
                color="yellow"
              />
              <StatCard
                title="Completed"
                value={stats.sosRequests.completed}
                subtitle="Successfully resolved"
                color="green"
              />
            </div>
          </div>

          {/* Shelter Statistics */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shelter Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Shelters"
                value={stats.shelters.total}
                subtitle={`${stats.shelters.active} active`}
                color="blue"
              />
              <StatCard
                title="Total Capacity"
                value={stats.shelters.totalCapacity}
                subtitle="Maximum people"
                color="purple"
              />
              <StatCard
                title="Current Occupancy"
                value={stats.shelters.totalOccupancy}
                subtitle={`${((stats.shelters.totalOccupancy / stats.shelters.totalCapacity) * 100).toFixed(1)}% full`}
                color="yellow"
              />
              <StatCard
                title="Available Space"
                value={stats.shelters.availableSpace}
                subtitle="People can be accommodated"
                color="green"
              />
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reports Last 7 Days</h3>
            <div className="space-y-3">
              {stats.reports.byDay.map((day) => (
                <div key={day._id} className="flex items-center">
                  <span className="w-24 text-sm text-gray-600">{day._id}</span>
                  <div className="flex-1 ml-4">
                    <div className="bg-gray-200 rounded-full h-6">
                      <div
                        className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${Math.max((day.count / Math.max(...stats.reports.byDay.map(d => d.count))) * 100, 5)}%`
                        }}
                      >
                        <span className="text-xs text-white font-medium">{day.count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Manage Users
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{stats.users.total}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Safe</p>
              <p className="text-3xl font-bold text-green-600">{stats.users.safe}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Need Help</p>
              <p className="text-3xl font-bold text-red-600">{stats.users.unsafe}</p>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Report Management</h3>
            <button
              onClick={() => navigate('/admin/reports')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Manage Reports
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Low</p>
                <p className="text-2xl font-bold text-blue-600">{stats.reports.bySeverity.low}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Medium</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.reports.bySeverity.medium}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">High</p>
                <p className="text-2xl font-bold text-orange-600">{stats.reports.bySeverity.high}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Severe</p>
                <p className="text-2xl font-bold text-red-600">{stats.reports.bySeverity.severe}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOS Tab */}
      {activeTab === 'sos' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">SOS Management</h3>
            <button
              onClick={() => navigate('/sos')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View All SOS
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Rescue</p>
              <p className="text-2xl font-bold text-red-600">{stats.sosRequests.byType.rescue}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Food</p>
              <p className="text-2xl font-bold text-orange-600">{stats.sosRequests.byType.food}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Medicine</p>
              <p className="text-2xl font-bold text-purple-600">{stats.sosRequests.byType.medicine}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Evacuation</p>
              <p className="text-2xl font-bold text-blue-600">{stats.sosRequests.byType.evacuation}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default AdminDashboard;
