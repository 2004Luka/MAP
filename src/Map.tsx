import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const cities = [
  { name: 'Tbilisi', lat: 41.7151, lng: 44.8271 },
  { name: 'Kutaisi', lat: 42.2500, lng: 42.7000 },
  { name: 'Batumi', lat: 41.6168, lng: 41.6367 },
  { name: 'Rustavi', lat: 41.5495, lng: 45.0360 },
  { name: 'Zugdidi', lat: 42.5126, lng: 41.8709 },
  { name: 'Gori', lat: 41.9844, lng: 44.1125 },
];

// Optional: Fit map to bounds dynamically
function FitBounds() {
  const map = useMap();
  const bounds: [number, number][] = cities.map(city => [city.lat, city.lng]);
  map.fitBounds(bounds, { padding: [40, 40] });
  return null;
}

export default function Map() {
  return (
    <MapContainer
      style={{ height: '70vh', width: '100%', borderRadius: '1rem', boxShadow: '0 2px 16px #0001' }}
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
          pathOptions={{ color: '#222', fillColor: '#2d8cff', fillOpacity: 0.85, weight: 1 }}
          eventHandlers={{
            mouseover: (e) => {
              e.target.setStyle({ fillColor: '#ff7b2d', radius: 12 });
            },
            mouseout: (e) => {
              e.target.setStyle({ fillColor: '#2d8cff', radius: 8 });
            },
          }}
        >
          <Popup>{city.name}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
} 