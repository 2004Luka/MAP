import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { PathfindingControls } from './components/PathfindingControls';
import L from 'leaflet';
import { cities } from './data/cities';

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
  const [roadDistance, setRoadDistance] = useState<number>(0);
  const [nodesExplored, setNodesExplored] = useState<number>(0);
  const [algorithmType, setAlgorithmType] = useState<'astar' | 'iddfs'>('astar');
  const [roadRoute, setRoadRoute] = useState<[number, number][]>([]);

  const handlePathFound = (path: string[], distance: number, explored: number, algorithm: 'astar' | 'iddfs') => {
    setPath(path);
    setTotalDistance(distance);
    setNodesExplored(explored);
    setAlgorithmType(algorithm);

    if (algorithm === 'astar') {
      // Fetch road route for A* algorithm
      fetchRoadRoute(path);
    } else {
      // Reset road route for IDDFS
      setRoadRoute([]);
      setRoadDistance(0);
    }
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
        // Calculate road distance from the route
        const roadDist = data.routes[0].distance / 1000; // Convert meters to kilometers
        setRoadDistance(roadDist);
      }
    } catch (error) {
      console.error('Error fetching road route:', error);
      setRoadDistance(0);
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
    <div className="relative w-full h-screen">
      <MapContainer
        center={[41.7151, 44.8271]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {cities.map((city) => (
          <CircleMarker
            key={city.name}
            center={[city.lat, city.lng]}
            radius={8}
            pathOptions={{
              color: '#3B82F6',
              fillColor: '#60A5FA',
              fillOpacity: 0.7,
              weight: 2,
            }}
            eventHandlers={{
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillColor: '#2563EB',
                  radius: 10,
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillColor: '#60A5FA',
                  radius: 8,
                });
              },
            }}
          >
            <Popup>
              <div className="text-sm font-medium">{city.name}</div>
              <div className="text-xs text-gray-500">{city.region}</div>
            </Popup>
          </CircleMarker>
        ))}
        {path.length > 0 && algorithmType === 'iddfs' && (
          <Polyline
            positions={path.map(cityName => {
              const city = cities.find(c => c.name === cityName);
              return city ? [city.lat, city.lng] : [0, 0];
            })}
            pathOptions={{
              color: '#3B82F6',
              weight: 3,
              opacity: 0.7,
            }}
          />
        )}
        {roadRoute.length > 0 && algorithmType === 'astar' && (
          <Polyline
            positions={roadRoute}
            pathOptions={{
              color: '#10B981',
              weight: 3,
              opacity: 0.7,
              dashArray: '5, 10',
            }}
          />
        )}
        <FitBounds />
      </MapContainer>
      <PathfindingControls
        onPathFound={handlePathFound}
        cities={cities}
        algorithmType={algorithmType}
        totalDistance={totalDistance}
        roadDistance={roadDistance}
        nodesExplored={nodesExplored}
      />
    </div>
  );
} 