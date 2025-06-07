import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Polyline } from 'react-leaflet';
import type { City } from './types';
import type { AlgorithmType } from './types';
import { createCustomIcon, getBoundsFromCities } from './utils/map';
import 'leaflet/dist/leaflet.css';
import { cities } from './data/cities';

interface MapProps {
  selectedCities: City[];
  path: string[];
  algorithm: AlgorithmType;
  roadRoute: [number, number][];
}

const Map = ({ selectedCities, path, algorithm, roadRoute }: MapProps) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current && selectedCities.length > 0) {
      const bounds = getBoundsFromCities(selectedCities);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedCities]);

  const getPathCoordinates = (path: string[]) => {
    return path.map(cityName => {
      const city = selectedCities.find(c => c.name === cityName);
      return city ? [city.lat, city.lng] as [number, number] : null;
    }).filter((coord): coord is [number, number] => coord !== null);
  };

  return (
    <MapContainer
      center={[42.3154, 43.3569]}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {/* All cities */}
      {cities.map((city) => (
        <CircleMarker
          key={city.name}
          center={[city.lat, city.lng]}
          radius={4}
          pathOptions={{
            fillColor: '#6B7280',
            color: '#374151',
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.7,
          }}
        />
      ))}

      {/* Selected cities */}
      {selectedCities.map((city, index) => (
        <Marker
          key={city.name}
          position={[city.lat, city.lng]}
          icon={createCustomIcon(index === 0 ? '#EF4444' : '#22C55E')}
        />
      ))}

      {/* Path visualization */}
      {path.length > 0 && (
        <>
          {/* Straight line path (only for IDDFS) */}
          {algorithm === 'iddfs' && (
            <Polyline
              positions={getPathCoordinates(path)}
              pathOptions={{
                color: '#3B82F6',
                weight: 3,
                opacity: 0.6,
                dashArray: '5, 10',
              }}
            />
          )}
          
          {/* Road route (only for A*) */}
          {algorithm === 'astar' && roadRoute.length > 0 && (
            <Polyline
              positions={roadRoute}
              pathOptions={{
                color: '#10B981',
                weight: 4,
                opacity: 0.8,
              }}
            />
          )}
        </>
      )}
    </MapContainer>
  );
};

export default Map; 