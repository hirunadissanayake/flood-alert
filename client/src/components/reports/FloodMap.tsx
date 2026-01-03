import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FloodReport } from '../../types';

interface FloodMapProps {
  reports: FloodReport[];
}

// Custom marker icons based on water level
const getMarkerIcon = (waterLevel: string) => {
  const colors = {
    low: '#3B82F6',      // blue
    medium: '#F59E0B',   // yellow/orange
    high: '#F97316',     // orange
    severe: '#EF4444',   // red
  };

  const color = colors[waterLevel as keyof typeof colors] || colors.low;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${color}" stroke="white" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function FloodMap({ reports }: FloodMapProps) {
  // Default center (Sri Lanka center)
  const defaultCenter: [number, number] = [7.8731, 80.7718];
  const defaultZoom = 8;

  // Calculate center based on reports if available
  const center: [number, number] = reports.length > 0
    ? [reports[0].location.lat, reports[0].location.lng]
    : defaultCenter;

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports.map((report) => (
          <Marker
            key={report._id}
            position={[report.location.lat, report.location.lng]}
            icon={getMarkerIcon(report.waterLevel)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {report.location.address}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {report.description}
                </p>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    report.waterLevel === 'low' ? 'bg-blue-100 text-blue-800' :
                    report.waterLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    report.waterLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.waterLevel.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    report.status === 'verified' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
                {report.imageUrl && (
                  <img
                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${report.imageUrl}`}
                    alt="Flood"
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Reported by: {report.userId.name}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(report.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default FloodMap;
