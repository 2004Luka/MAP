import { useRef, useEffect } from 'react';
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

  const getTileLayerUrl = (style: string) => {
    switch (style) {
      case 'light_all':
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      case 'dark_all':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'rastertiles/voyager':
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      default:
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[42.3154, 43.3569]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        attributionControl={false}
        className="rounded-lg overflow-hidden shadow-strong"
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        easeLinearity={0.35}
      >
        <TileLayer
          url={getTileLayerUrl(mapStyle)}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
          minZoom={3}
        />
        
        {/* Enhanced city markers with better styling */}
        {cities.map((city) => (
          <CircleMarker
            key={city.name}
            center={[city.lat, city.lng]}
            radius={markerStyle.size}
            pathOptions={{
              fillColor: markerStyle.color,
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            }}
            eventHandlers={{
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 1,
                  weight: 3,
                  radius: markerStyle.size + 2
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.8,
                  weight: 2,
                  radius: markerStyle.size
                });
              }
            }}
          />
        ))}

        {/* Enhanced selected city markers */}
        {selectedCities.map((city, index) => (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={createCustomIcon(index === 0 ? '#EF4444' : '#22C55E')}
            eventHandlers={{
              mouseover: (e) => {
                const marker = e.target;
                marker.getElement()?.style.setProperty('transform', 'scale(1.2)');
              },
              mouseout: (e) => {
                const marker = e.target;
                marker.getElement()?.style.setProperty('transform', 'scale(1)');
              }
            }}
          />
        ))}

        {/* Enhanced route visualization */}
        {path.length > 0 && (
          <>
            {algorithm === 'iddfs' && (
              <Polyline
                positions={getPathCoordinates(path)}
                pathOptions={{
                  color: routeStyle.color,
                  weight: routeStyle.weight,
                  opacity: routeStyle.opacity,
                  dashArray: '8, 12',
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            )}
            
            {algorithm === 'astar' && roadRoute.length > 0 && (
              <Polyline
                positions={roadRoute}
                pathOptions={{
                  color: routeStyle.color,
                  weight: routeStyle.weight,
                  opacity: routeStyle.opacity,
                  lineCap: 'round',
                  lineJoin: 'round',
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
        mapStyle={mapStyle}
      />
    </div>
  );
};

export default Map; 