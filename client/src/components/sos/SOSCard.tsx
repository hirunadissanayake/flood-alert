import { SOSRequest } from '../../types';

interface SOSCardProps {
  request: SOSRequest;
  onUpdate?: (id: string) => void;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

function SOSCard({ request, onUpdate, onDelete, canDelete = false }: SOSCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    accepted: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };

  const typeConfig = {
    rescue: {
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    food: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    medicine: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    evacuation: {
      gradient: 'from-pink-500 to-pink-600',
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  };

  const config = typeConfig[request.type];

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 ${config.border}`}>
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${config.gradient} p-5 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-20">
          <div className="scale-150">
            {config.icon}
          </div>
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              {config.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {request.type.toUpperCase()} REQUEST
              </h3>
              <p className="text-sm text-white/90 mt-0.5">Emergency Assistance Needed</p>
            </div>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 backdrop-blur-md bg-white/90 ${
              statusColors[request.status]
            }`}
          >
            {request.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className={`p-6 ${config.bg}`}>
        {/* Location */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
            <p className="text-gray-900 font-semibold">{request.location.address}</p>
          </div>
        </div>
        
        {/* Description */}
        {request.description && (
          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Details</p>
            <p className="text-gray-700 leading-relaxed">{request.description}</p>
          </div>
        )}

        {/* Contact and Time */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Contact</p>
              <p className="text-sm font-semibold text-gray-900">{request.userId.phoneNumber || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Time</p>
              <p className="text-sm font-semibold text-gray-900">{new Date(request.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(onUpdate || (canDelete && onDelete)) && (
          <div className="flex gap-3 pt-2">
            {onUpdate && (
              <button
                onClick={() => onUpdate(request._id)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Status
              </button>
            )}
            {canDelete && onDelete && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this SOS request?')) {
                    onDelete(request._id);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 transition font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SOSCard;
