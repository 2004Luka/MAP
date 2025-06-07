import { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Polyline } from 'react-leaflet';
import type { City } from './types';
import type { AlgorithmType } from './types';
import { createCustomIcon, getBoundsFromCities } from './utils/map';
import Settings from './components/Settings';
import 'leaflet/dist/leaflet.css';
import { cities } from './data/cities';

interface MapProps {
  selectedCities: City[];
  path: string[];
  algorithm: AlgorithmType;
  roadRoute: [number, number][];
  mapStyle: string;
  markerStyle: { size: number; color: string };
  routeStyle: { weight: number; color: string; opacity: number };
  setMapStyle: (style: string) => void;
  setMarkerStyle: (style: { size: number; color: string }) => void;
  setRouteStyle: (style: { weight: number; color: string; opacity: number }) => void;
}

const Map = ({ selectedCities, path, algorithm, roadRoute, mapStyle, markerStyle, routeStyle, setMapStyle, setMarkerStyle, setRouteStyle }: MapProps) => {
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
    <div className="relative w-full h-full">
      <MapContainer
        center={[42.3154, 43.3569]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        attributionControl={false}
      >
        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/${mapStyle}/{z}/{x}/{y}{r}.png`}
        />
        
        {/* All cities */}
        {cities.map((city) => (
          <CircleMarker
            key={city.name}
            center={[city.lat, city.lng]}
            radius={markerStyle.size}
            pathOptions={{
              fillColor: markerStyle.color,
              color: markerStyle.color,
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
                  color: routeStyle.color,
                  weight: routeStyle.weight,
                  opacity: routeStyle.opacity,
                  dashArray: '5, 10',
                }}
              />
            )}
            
            {/* Road route (only for A*) */}
            {algorithm === 'astar' && roadRoute.length > 0 && (
              <Polyline
                positions={roadRoute}
                pathOptions={{
                  color: routeStyle.color,
                  weight: routeStyle.weight,
                  opacity: routeStyle.opacity,
                }}
              />
            )}
          </>
        )}
      </MapContainer>

      <Settings
        onMapStyleChange={setMapStyle}
        onMarkerStyleChange={setMarkerStyle}
        onRouteStyleChange={setRouteStyle}
      />
    </div>
  );
};

export default Map; 