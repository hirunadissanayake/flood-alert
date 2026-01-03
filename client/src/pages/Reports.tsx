import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getReports, deleteReport } from '../redux/slices/reportSlice';
import Layout from '../components/layout/Layout';
import ReportCard from '../components/reports/ReportCard';
import ReportForm from '../components/reports/ReportForm';
import FloodMap from '../components/reports/FloodMap';
import Comments from '../components/reports/Comments';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { FloodReport } from '../types';

function Reports() {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, isLoading } = useSelector((state: RootState) => state.reports);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedReport, setSelectedReport] = useState<FloodReport | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  useEffect(() => {
    dispatch(getReports());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      await dispatch(deleteReport(id));
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    dispatch(getReports());
  };

  const handleViewComments = (id: string) => {
    const report = reports.find(r => r._id === id);
    if (report) {
      setSelectedReport(report);
      setShowCommentsModal(true);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Flood Reports</h2>
        <div className="flex space-x-3">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md transition ${
                viewMode === 'list'
                  ? 'bg-white shadow text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md transition ${
                viewMode === 'map'
                  ? 'bg-white shadow text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Map View
            </button>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'New Report'}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Submit Flood Report</h3>
          <ReportForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner text="Loading reports..." />
      ) : viewMode === 'map' ? (
        <FloodMap reports={reports} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onDelete={
                user?.role === 'admin' || report.userId._id === user?._id
                  ? handleDelete
                  : undefined
              }
              onViewComments={handleViewComments}
            />
          ))}
          {reports.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg">No reports available</p>
              <p className="text-sm mt-2">Be the first to report a flood incident</p>
            </div>
          )}
        </div>
      )}

      {/* Comments Modal */}
      <Modal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        title={`Comments - ${selectedReport?.location.address}`}
        size="large"
      >
        {selectedReport && <Comments reportId={selectedReport._id} />}
      </Modal>
    </Layout>
  );
}

export default Reports;
