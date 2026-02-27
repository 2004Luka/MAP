import L from 'leaflet';
import type { City } from '../types';

export const createStartIcon = () => {
  return L.divIcon({
    className: 'start-marker-icon',
    html: `<div style="
      background: linear-gradient(135deg, #10B981, #059669);
      width: 32px; 
      height: 32px; 
      border-radius: 50% 50% 0 50%; 
      border: 3px solid white; 
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4), 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
      transform: rotate(45deg);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        transform: rotate(-45deg);
      "></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export const createEndIcon = () => {
  return L.divIcon({
    className: 'end-marker-icon',
    html: `<div style="
      background: linear-gradient(135deg, #EF4444, #DC2626);
      width: 32px; 
      height: 32px; 
      border-radius: 50% 50% 50% 0; 
      border: 3px solid white; 
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4), 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
      transform: rotate(-45deg);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export const createWaypointIcon = (index: number) => {
  return L.divIcon({
    className: 'waypoint-marker-icon',
    html: `<div style="
      background: white;
      color: #737373;
      width: 24px; 
      height: 24px; 
      border-radius: 50%; 
      border: 2px solid #A3A3A3; 
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      font-family: 'Inter', sans-serif;
    ">
      ${index + 1}
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const getBoundsFromCities = (cities: City[]): L.LatLngBounds => {
  const bounds = L.latLngBounds([]);
  cities.forEach(city => {
    bounds.extend([city.lat, city.lng]);
  });
  return bounds;
};
