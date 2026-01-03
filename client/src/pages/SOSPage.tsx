import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getSOSRequests, deleteSOSRequest } from '../redux/slices/sosSlice';
import Layout from '../components/layout/Layout';
import SOSCard from '../components/sos/SOSCard';
import SOSForm from '../components/sos/SOSForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Modal from '../components/common/Modal';
import api from '../services/api';

function SOSPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, isLoading } = useSelector((state: RootState) => state.sos);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    dispatch(getSOSRequests());
  }, [dispatch]);

  const handleFormSuccess = () => {
    setShowForm(false);
    dispatch(getSOSRequests());
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSOSRequest(id)).unwrap();
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
      dispatch(getSOSRequests());
    } catch (error) {
      console.error('Failed to delete SOS request:', error);
    }
  };

  const handleStatusUpdate = (id: string) => {
    setSelectedRequest(id);
    setShowStatusModal(true);
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      setStatusUpdateLoading(true);
      await api.put(`/sos/${selectedRequest}/accept`);
      setShowStatusModal(false);
      setSelectedRequest(null);
      dispatch(getSOSRequests());
    } catch (error: any) {
      console.error('Failed to accept request:', error);
      alert(error.response?.data?.message || 'Failed to accept request');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleCompleteRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      setStatusUpdateLoading(true);
      await api.put(`/sos/${selectedRequest}/complete`);
      setShowStatusModal(false);
      setSelectedRequest(null);
      dispatch(getSOSRequests());
    } catch (error: any) {
      console.error('Failed to complete request:', error);
      alert(error.response?.data?.message || 'Failed to complete request');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getSelectedRequestData = () => {
    return requests.find(r => r._id === selectedRequest);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">SOS Requests</h2>
        <Button
          variant="danger"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Send SOS'}
        </Button>
      </div>

      {deleteSuccess && (
        <Alert type="success" message="SOS request deleted successfully" />
      )}

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Submit SOS Request</h3>
          <SOSForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner text="Loading SOS requests..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <SOSCard 
              key={request._id} 
              request={request}
              onUpdate={user?.role === 'admin' ? handleStatusUpdate : undefined}
              onDelete={handleDelete}
              canDelete={user?.role === 'admin' || request.userId._id === user?._id}
            />
          ))}
          {requests.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg">No SOS requests</p>
              <p className="text-sm mt-2">All safe for now</p>
            </div>
          )}
        </div>
      )}

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedRequest(null);
        }}
        title="Update SOS Request Status"
      >
        {getSelectedRequestData() && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Status</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {getSelectedRequestData()?.status}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2 font-medium">Request Details</p>
              <p className="text-sm text-gray-700"><strong>Type:</strong> {getSelectedRequestData()?.type}</p>
              <p className="text-sm text-gray-700"><strong>Location:</strong> {getSelectedRequestData()?.location.address}</p>
              <p className="text-sm text-gray-700"><strong>Requester:</strong> {getSelectedRequestData()?.userId.name}</p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {getSelectedRequestData()?.status === 'pending' && (
                <button
                  onClick={handleAcceptRequest}
                  disabled={statusUpdateLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {statusUpdateLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Accept Request
                    </>
                  )}
                </button>
              )}

              {getSelectedRequestData()?.status === 'accepted' && (
                <button
                  onClick={handleCompleteRequest}
                  disabled={statusUpdateLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {statusUpdateLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Completed
                    </>
                  )}
                </button>
              )}

              {getSelectedRequestData()?.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-800 font-semibold">This request has been completed</p>
                </div>
              )}

              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedRequest(null);
                }}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-300 transition font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

export default SOSPage;
