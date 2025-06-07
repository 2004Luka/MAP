import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { PathfindingControls } from './components/PathfindingControls';
import L from 'leaflet';

const cities = [
  { name: 'Tbilisi', lat: 41.7151, lng: 44.8271 },
  { name: 'Kutaisi', lat: 42.2500, lng: 42.7000 },
  { name: 'Batumi', lat: 41.6168, lng: 41.6367 },
  { name: 'Rustavi', lat: 41.5495, lng: 45.0360 },
  { name: 'Zugdidi', lat: 42.5126, lng: 41.8709 },
  { name: 'Gori', lat: 41.9844, lng: 44.1125 },
  { name: 'Telavi', lat: 41.9192, lng: 45.4736 },
  { name: 'Akhaltsikhe', lat: 41.6396, lng: 42.9826 },
  { name: 'Poti', lat: 42.1466, lng: 41.6710 },
  { name: 'Samtredia', lat: 42.1531, lng: 42.3358 },
  { name: 'Marneuli', lat: 41.4750, lng: 44.8100 },
  { name: 'Ozurgeti', lat: 41.9244, lng: 42.0006 },
  { name: 'Khashuri', lat: 41.9931, lng: 43.6021 },
  { name: 'Senaki', lat: 42.2706, lng: 42.0644 },
  { name: 'Kaspi', lat: 41.9194, lng: 44.4231 },
  { name: 'Chiatura', lat: 42.2897, lng: 43.2936 },
  { name: 'Gardabani', lat: 41.4622, lng: 45.0947 },
  { name: 'Tskaltubo', lat: 42.3222, lng: 42.6000 },
  { name: 'Sagarejo', lat: 41.7361, lng: 45.3300 },
  { name: 'Mtskheta', lat: 41.8450, lng: 44.7200 },
];

// Optional: Fit map to bounds dynamically
function FitBounds() {
  const map = useMap();
  const bounds: [number, number][] = cities.map(city => [city.lat, city.lng]);
  map.fitBounds(bounds, { padding: [40, 40] });
  return null;
}

// Custom icon for distance markers
const createDistanceIcon = (distance: number) => {
  return L.divIcon({
    className: 'distance-label',
    html: `<div class="bg-white px-2 py-1 rounded-full shadow-md text-sm font-medium text-gray-700">${distance.toFixed(1)} km</div>`,
    iconSize: [100, 20],
    iconAnchor: [50, 10],
  });
};

export default function Map() {
  const [path, setPath] = useState<string[]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [nodesExplored, setNodesExplored] = useState<number>(0);
  const [algorithmType, setAlgorithmType] = useState<'astar' | 'iddfs'>('astar');
  const [roadRoute, setRoadRoute] = useState<[number, number][]>([]);

  const handlePathFound = (newPath: string[], distance: number, explored: number, type: 'astar' | 'iddfs') => {
    setPath(newPath);
    setTotalDistance(distance);
    setNodesExplored(explored);
    setAlgorithmType(type);
    fetchRoadRoute(newPath);
  };

  const fetchRoadRoute = async (path: string[]) => {
    if (path.length < 2) return;

    try {
      const coordinates = path.map(cityName => {
        const city = cities.find(c => c.name === cityName);
        return city ? `${city.lng},${city.lat}` : null;
      }).filter((coord): coord is string => coord !== null);

      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates.join(';')}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const routeCoordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
        setRoadRoute(routeCoordinates);
      }
    } catch (error) {
      console.error('Error fetching road route:', error);
    }
  };

  const getPathCoordinates = () => {
    return path.map(cityName => {
      const city = cities.find(c => c.name === cityName);
      return city ? [city.lat, city.lng] as [number, number] : null;
    }).filter((coord): coord is [number, number] => coord !== null);
  };

  const getMidpoint = (coord1: [number, number], coord2: [number, number]): [number, number] => {
    return [(coord1[0] + coord2[0]) / 2, (coord1[1] + coord2[1]) / 2];
  };

  const calculateSegmentDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-0">
      <PathfindingControls onPathFound={handlePathFound} cities={cities} />
      <MapContainer
        className="w-full h-full relative z-0"
        center={[42.0, 43.5]}
        zoom={7}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        dragging={true}
        doubleClickZoom={true}
        keyboard={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
        />
        <FitBounds />
        {cities.map(city => (
          <CircleMarker
            key={city.name}
            center={[city.lat, city.lng]}
            radius={8}
            pathOptions={{ 
              color: '#222', 
              fillColor: path.includes(city.name) ? '#ff7b2d' : '#2d8cff', 
              fillOpacity: 0.85, 
              weight: 1 
            }}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ fillColor: '#ff7b2d', radius: 12 });
              },
              mouseout: (e) => {
                e.target.setStyle({ 
                  fillColor: path.includes(city.name) ? '#ff7b2d' : '#2d8cff', 
                  radius: 8 
                });
              },
            }}
          >
            <Popup>
              <div className="text-center">
                <div className="font-medium">{city.name}</div>
                {path.includes(city.name) && (
                  <div className="text-sm text-gray-600">
                    Part of the route
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
        {path.length > 0 && (
          <>
            {/* Straight line path */}
            <Polyline
              positions={getPathCoordinates()}
              pathOptions={{
                color: '#ff7b2d',
                weight: 4,
                opacity: 0.8,
                dashArray: '5, 10',
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Road-based route */}
            {algorithmType === 'astar' && roadRoute.length > 0 && (
              <Polyline
                positions={roadRoute}
                pathOptions={{
                  color: '#4CAF50',
                  weight: 6,
                  opacity: 0.8,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            )}
            {/* Distance labels */}
            {getPathCoordinates().map((coord, index) => {
              if (index < getPathCoordinates().length - 1) {
                const nextCoord = getPathCoordinates()[index + 1];
                const midpoint = getMidpoint(coord, nextCoord);
                const distance = calculateSegmentDistance(coord, nextCoord);
                return (
                  <Marker
                    key={`${coord[0]}-${coord[1]}`}
                    position={midpoint}
                    icon={createDistanceIcon(distance)}
                  />
                );
              }
              return null;
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
} 