import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getReports, deleteReport } from '../redux/slices/reportSlice';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import api from '../services/api';

function AdminReports() {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, isLoading } = useSelector((state: RootState) => state.reports);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');

  useEffect(() => {
    dispatch(getReports());
  }, [dispatch]);

  const handleVerify = async (id: string) => {
    try {
      await api.put(`/reports/${id}/verify`);
      setAlert({ type: 'success', message: 'Report verified successfully' });
      dispatch(getReports());
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Failed to verify report' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }
    
    try {
      await dispatch(deleteReport(id)).unwrap();
      setAlert({ type: 'success', message: 'Report deleted successfully' });
      dispatch(getReports());
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      setAlert({ type: 'error', message: 'Failed to delete report' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const waterLevelColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    severe: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 border-gray-300',
    verified: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <Layout>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">Report Verification</h2>
            <p className="text-purple-100">Review and verify flood reports from users</p>
          </div>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2 mb-6 inline-flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Reports ({reports.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'pending'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Pending ({reports.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'verified'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Verified ({reports.filter(r => r.status === 'verified').length})
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading reports..." />
      ) : (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 p-6 rounded-full">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500">No reports match the selected filter</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="md:flex">
                  {/* Image Section */}
                  {report.imageUrl && (
                    <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${report.imageUrl}`}
                        alt="Flood report"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className={`${report.imageUrl ? 'md:w-2/3' : 'w-full'} p-6`}>
                    {/* Header with badges */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${waterLevelColors[report.waterLevel]}`}>
                          {report.waterLevel.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${statusColors[report.status]}`}>
                          {report.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{new Date(report.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                      <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="text-lg font-bold text-gray-900">{report.location.address}</h3>
                    </div>

                    {/* User info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">{report.userId.name}</span>
                      <span className="text-gray-400">•</span>
                      <span>{report.userId.email}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{report.description}</p>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {report.status === 'pending' && (
                        <button
                          onClick={() => handleVerify(report._id)}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Verify Report
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(report._id)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-2.5 px-4 rounded-xl hover:from-red-700 hover:to-rose-700 transition font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Layout>
  );
}

export default AdminReports;
