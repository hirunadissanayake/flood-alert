import { Shelter } from '../../types';

interface ShelterCardProps {
  shelter: Shelter;
}

function ShelterCard({ shelter }: ShelterCardProps) {
  const occupancyPercentage = (shelter.currentOccupancy / shelter.capacity) * 100;

  const getOccupancyColor = () => {
    if (occupancyPercentage > 80) return 'bg-red-500';
    if (occupancyPercentage > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getOccupancyStatus = () => {
    if (occupancyPercentage > 80) return { text: 'Almost Full', color: 'text-red-600' };
    if (occupancyPercentage > 50) return { text: 'Filling Up', color: 'text-yellow-600' };
    return { text: 'Available', color: 'text-green-600' };
  };

  const status = getOccupancyStatus();

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{shelter.name}</h3>
            <div className="flex items-center gap-2">
              {shelter.isActive ? (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ACTIVE
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-gray-400/30 backdrop-blur-sm rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  INACTIVE
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Location */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase">Address</p>
            <p className="text-gray-900 font-medium">{shelter.location.address}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
            <p className="text-gray-900 font-semibold">{shelter.phone}</p>
          </div>
        </div>

        {/* Capacity */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {shelter.currentOccupancy} <span className="text-sm text-gray-500">/ {shelter.capacity}</span>
              </p>
            </div>
            <div className={`text-sm font-bold ${status.color}`}>
              {status.text}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getOccupancyColor()}`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">{occupancyPercentage.toFixed(0)}% occupied</p>
        </div>

        {/* Facilities */}
        {shelter.facilities && shelter.facilities.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Facilities Available
            </p>
            <div className="flex flex-wrap gap-2">
              {shelter.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 text-sm font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Directions
          </button>
          <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 text-sm font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShelterCard;
