import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { getReports } from '../redux/slices/reportSlice';
import { getSOSRequests } from '../redux/slices/sosSlice';
import { getShelters } from '../redux/slices/shelterSlice';
import Layout from '../components/layout/Layout';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { reports, isLoading: reportsLoading } = useSelector((state: RootState) => state.reports);
  const { requests } = useSelector((state: RootState) => state.sos);
  const { shelters } = useSelector((state: RootState) => state.shelters);

  useEffect(() => {
    dispatch(getReports());
    dispatch(getSOSRequests());
    dispatch(getShelters());
  }, [dispatch]);

  if (reportsLoading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">
              Here's what's happening in your community today
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 w-fit">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-xs sm:text-sm md:text-base">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Total Reports"
          value={reports.length}
          icon="report"
          color="blue"
          subtitle="Flood incidents reported"
        />
        <StatCard
          title="SOS Requests"
          value={requests.length}
          icon="sos"
          color="red"
          subtitle="Emergency distress calls"
        />
        <StatCard
          title="Available Shelters"
          value={shelters.length}
          icon="shelter"
          color="green"
          subtitle="Safe zones nearby"
        />
        <StatCard
          title="Pending Reports"
          value={reports.filter((r) => r.status === 'pending').length}
          icon="pending"
          color="yellow"
          subtitle="Awaiting verification"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Flood Reports */}
        <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Recent Flood Reports
              </h3>
            </div>
            <Link to="/reports" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
            {reports.slice(0, 5).map((report) => (
              <div key={report._id} className="border-l-4 border-blue-500 bg-blue-50 pl-3 sm:pl-4 pr-3 sm:pr-4 py-3 rounded-r-lg hover:bg-blue-100 transition">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{report.location.address}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-200 text-blue-800">
                        {report.waterLevel}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600">Water Level</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(report.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-block p-3 sm:p-4 bg-gray-100 rounded-full mb-3 sm:mb-4">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium text-sm sm:text-base">No reports yet</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Be the first to report a flood incident</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <Link
              to="/reports"
              className="group block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base sm:text-lg">Report Flood Incident</p>
                    <p className="text-blue-100 text-xs sm:text-sm">Alert your community</p>
                  </div>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              to="/sos"
              className="group block w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-3 sm:p-4 rounded-xl hover:from-red-700 hover:to-red-800 transition shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base sm:text-lg">Send SOS Request</p>
                    <p className="text-red-100 text-xs sm:text-sm">Emergency assistance</p>
                  </div>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              to="/shelters"
              className="group block w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-3 sm:p-4 rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base sm:text-lg">Find Nearest Shelter</p>
                    <p className="text-green-100 text-xs sm:text-sm">Safe zones nearby</p>
                  </div>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          {/* Emergency Tips */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900 text-xs sm:text-sm">Safety Tip</p>
                <p className="text-amber-800 text-xs mt-1">
                  Always move to higher ground during floods and never attempt to walk or drive through flood water.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
