import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface GoogleMapPickerProps {
  location: Location;
  onChange: (location: Location) => void;
  height?: string;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places'];

function GoogleMapPicker({ location, onChange, height = '400px' }: GoogleMapPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<Location>(location);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries
  });

  // Update marker when location prop changes
  useEffect(() => {
    if (location.lat !== 0 || location.lng !== 0) {
      setMarker(location);
    }
  }, [location]);

  const center = {
    lat: marker.lat !== 0 ? marker.lat : 6.9271,
    lng: marker.lng !== 0 ? marker.lng : 79.8612
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleLocationUpdate = useCallback(
    async (lat: number, lng: number) => {
      setIsGeocoding(true);
      // Reverse geocoding to get address
      try {
        const geocoder = new google.maps.Geocoder();
        const result = await geocoder.geocode({ location: { lat, lng } });
        
        console.log('Geocoding result:', result);
        
        if (result.results && result.results.length > 0) {
          const address = result.results[0].formatted_address;
          console.log('✅ Formatted address:', address);
          setGeocodingError(false);
          const newLocation = { lat, lng, address };
          setMarker(newLocation);
          onChange(newLocation);
        } else {
          console.warn('⚠️  No geocoding results found. Geocoding API may not be enabled.');
          console.warn('📝 Enable Geocoding API: https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com');
          setGeocodingError(true);
          const address = `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          const newLocation = { lat, lng, address };
          setMarker(newLocation);
          onChange(newLocation);
        }
      } catch (error: any) {
        console.error('❌ Geocoding error:', error);
        if (error.message && error.message.includes('API')) {
          console.error('🔑 Geocoding API is not enabled for your API key');
          console.error('📝 To fix: Go to https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com');
          console.error('   Click "Enable" and wait 1-2 minutes');
        }
        setGeocodingError(true);
        const address = `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        const newLocation = { lat, lng, address };
        setMarker(newLocation);
        onChange(newLocation);
      } finally {
        setIsGeocoding(false);
      }
    },
    [onChange]
  );

  const onMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        await handleLocationUpdate(lat, lng);
      }
    },
    [handleLocationUpdate]
  );

  const onMarkerDragEnd = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        await handleLocationUpdate(lat, lng);
      }
    },
    [handleLocationUpdate]
  );

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGeocoding(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);
          }

          await handleLocationUpdate(lat, lng);
        },
        (error) => {
          setIsGeocoding(false);
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location permissions and try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  if (!apiKey) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm font-medium">
          Google Maps API key is not configured.
        </p>
        <p className="text-yellow-700 text-xs mt-1">
          Please add VITE_GOOGLE_MAPS_API_KEY to your .env file in the client directory.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm font-medium">
          Error loading Google Maps
        </p>
        <p className="text-red-700 text-xs mt-1">
          {loadError.message}
        </p>
        <p className="text-red-700 text-xs mt-2">
          Please check that you've enabled the Maps JavaScript API and Geocoding API in Google Cloud Console.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <p className="text-blue-700 text-sm">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {geocodingError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-yellow-800 text-sm font-medium">⚠️ Geocoding API Not Enabled</p>
          <p className="text-yellow-700 text-xs mt-1">
            Showing coordinates instead of address. To get location names:
          </p>
          <ol className="text-yellow-700 text-xs mt-1 ml-4 list-decimal">
            <li>Go to <a href="https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
            <li>Click "Enable" for Geocoding API</li>
            <li>Wait 1-2 minutes and refresh this page</li>
          </ol>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Select Location on Map
        </label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGeocoding}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isGeocoding ? 'Getting location...' : 'Use My Location'}
        </button>
      </div>
      
      {isGeocoding && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-blue-700 text-xs">Getting address...</p>
          </div>
        </div>
      )}
      
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height }}
        center={center}
        zoom={marker.lat !== 0 ? 15 : 12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'greedy',
        }}
      >
        {marker.lat !== 0 && marker.lng !== 0 && (
          <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-600 mb-1">
          <strong>How to select location:</strong>
        </p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Click anywhere on the map to pin a location</li>
          <li>Drag the marker to adjust the position</li>
          <li>Use "Use My Location" for current GPS position</li>
        </ul>
        {marker.lat !== 0 && marker.lng !== 0 && (
          <p className="text-xs text-green-700 mt-2 font-medium">
            ✓ Selected: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  );
}

export default GoogleMapPicker;
