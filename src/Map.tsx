import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { PathfindingControls } from './components/PathfindingControls';
import L from 'leaflet';

const cities = [
  // Major Cities
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
  
  // Additional Cities and Towns
  { name: 'Bolnisi', lat: 41.4472, lng: 44.5389 },
  { name: 'Kobuleti', lat: 41.8200, lng: 41.7750 },
  { name: 'Zestaponi', lat: 42.1100, lng: 43.0400 },
  { name: 'Gurjaani', lat: 41.7439, lng: 45.8000 },
  { name: 'Kvareli', lat: 41.9500, lng: 45.8167 },
  { name: 'Akhmeta', lat: 42.0333, lng: 45.2000 },
  { name: 'Dusheti', lat: 42.0833, lng: 44.7000 },
  { name: 'Tianeti', lat: 42.1167, lng: 44.9667 },
  { name: 'Manglisi', lat: 41.7000, lng: 44.3833 },
  { name: 'Tetritskaro', lat: 41.5500, lng: 44.4667 },
  { name: 'Dmanisi', lat: 41.3333, lng: 44.2000 },
  { name: 'Tsalka', lat: 41.6000, lng: 44.0833 },
  { name: 'Ninotsminda', lat: 41.2667, lng: 43.5833 },
  { name: 'Akhalkalaki', lat: 41.4000, lng: 43.4833 },
  { name: 'Aspindza', lat: 41.5667, lng: 43.2500 },
  { name: 'Borjomi', lat: 41.8500, lng: 43.4000 },
  { name: 'Bakuriani', lat: 41.7333, lng: 43.4833 },
  { name: 'Ambrolauri', lat: 42.5167, lng: 43.1500 },
  { name: 'Oni', lat: 42.5833, lng: 43.4500 },
  { name: 'Lentekhi', lat: 42.7833, lng: 42.7167 },
  { name: 'Mestia', lat: 43.0500, lng: 42.7167 },
  { name: 'Abasha', lat: 42.2000, lng: 42.2000 },
  { name: 'Khoni', lat: 42.3167, lng: 42.4167 },
  { name: 'Tkibuli', lat: 42.3500, lng: 42.9833 },
  { name: 'Terjola', lat: 42.1833, lng: 43.0000 },
  { name: 'Vani', lat: 42.0833, lng: 42.5167 },
  { name: 'Baghdati', lat: 42.0667, lng: 42.8167 },
  { name: 'Kharagauli', lat: 42.0167, lng: 43.2000 },
  
  // Additional Towns and Settlements
  { name: 'Lagodekhi', lat: 41.8167, lng: 46.2667 },
  { name: 'Dedoplistskaro', lat: 41.4667, lng: 46.1167 },
  { name: 'Sighnaghi', lat: 41.6167, lng: 45.9167 },
  { name: 'Tsnori', lat: 41.6167, lng: 45.9667 },
  { name: 'Tsinandali', lat: 41.9000, lng: 45.5667 },
  { name: 'Pshaveli', lat: 42.0167, lng: 45.4833 },
  { name: 'Omalo', lat: 42.3833, lng: 45.6333 },
  { name: 'Shatili', lat: 42.6667, lng: 45.1667 },
  { name: 'Ananuri', lat: 42.1667, lng: 44.7000 },
  { name: 'Pasanauri', lat: 42.3500, lng: 44.6833 },
  { name: 'Gudauri', lat: 42.4833, lng: 44.4833 },
  { name: 'Stepantsminda', lat: 42.6500, lng: 44.6500 },
  { name: 'Jvari', lat: 42.7167, lng: 42.0500 },
  { name: 'Tsalenjikha', lat: 42.5833, lng: 42.0667 },
  { name: 'Chkhorotsku', lat: 42.5167, lng: 42.1167 },
  { name: 'Martvili', lat: 42.4167, lng: 42.3667 },
  { name: 'Khobi', lat: 42.3167, lng: 41.9000 },
  { name: 'Anaklia', lat: 42.4000, lng: 41.5667 },
  { name: 'Ganmukhuri', lat: 42.3500, lng: 41.7167 },
  { name: 'Ureki', lat: 41.9833, lng: 41.7667 },
  { name: 'Chakvi', lat: 41.7167, lng: 41.7333 },
  { name: 'Keda', lat: 41.6000, lng: 41.9500 },
  { name: 'Shuakhevi', lat: 41.6333, lng: 42.1833 },
  { name: 'Khulo', lat: 41.6500, lng: 42.3167 },
  { name: 'Adigeni', lat: 41.6833, lng: 42.7000 },
  { name: 'Akhaldaba', lat: 41.6500, lng: 43.4833 },
  { name: 'Tsaghveri', lat: 41.8000, lng: 43.4833 },
  { name: 'Surami', lat: 42.0167, lng: 43.5500 },
  { name: 'Kareli', lat: 42.0167, lng: 43.9000 }
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