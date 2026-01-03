import { useJsApiLoader } from '@react-google-maps/api';
import { ReactNode } from 'react';

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places'];

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries
  });

  if (loadError) {
    console.error('Google Maps load error:', loadError);
  }

  return <>{children}</>;
}

export function useGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries
  });
}
