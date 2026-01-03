import { FloodReport } from '../../types';

interface ReportCardProps {
  report: FloodReport;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewComments?: (id: string) => void;
}

function ReportCard({ report, onEdit, onDelete, onViewComments }: ReportCardProps) {
  const waterLevelColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    severe: 'bg-red-100 text-red-800 border-red-200',
  };

  const waterLevelIcons = {
    low: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    medium: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
      </svg>
    ),
    high: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
      </svg>
    ),
    severe: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 border-gray-200',
    verified: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {report.imageUrl && (
        <div className="relative h-56 overflow-hidden">
          <img
            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${report.imageUrl}`}
            alt="Flood report"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 backdrop-blur-md bg-white/90 flex items-center gap-1 ${
                waterLevelColors[report.waterLevel]
              }`}
            >
              {waterLevelIcons[report.waterLevel]}
              {report.waterLevel.toUpperCase()}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 backdrop-blur-md bg-white/90 ${
                statusColors[report.status]
              }`}
            >
              {report.status.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {report.location.address}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{report.userId.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{new Date(report.timestamp).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed">{report.description}</p>

        {!report.imageUrl && (
          <div className="flex items-center space-x-2 mb-4">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1 ${
                waterLevelColors[report.waterLevel]
              }`}
            >
              {waterLevelIcons[report.waterLevel]}
              {report.waterLevel.toUpperCase()}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                statusColors[report.status]
              }`}
            >
              {report.status.toUpperCase()}
            </span>
          </div>
        )}

        {(onEdit || onDelete || onViewComments) && (
          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            {onViewComments && (
              <button
                onClick={() => onViewComments(report._id)}
                className="flex-1 bg-purple-600 text-white py-2.5 px-4 rounded-xl hover:bg-purple-700 transition font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Comments
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(report._id)}
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(report._id)}
                className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-xl hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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

export default ReportCard;
