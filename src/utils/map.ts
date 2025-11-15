import type { City } from '../types';
import L from 'leaflet';

export const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background: radial-gradient(circle at 30% 30%, ${color}, ${color}dd);
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
      transform: scale(1);
      transition: transform 0.2s ease;
    ">
      <div style="
        position: absolute;
        top: 25%;
        left: 25%;
        width: 50%;
        height: 50%;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0.8);
      "></div>
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export const createStartIcon = () => {
  return L.divIcon({
    className: 'start-marker-icon',
    html: `<div style="
      background: linear-gradient(135deg, #D9AF6B, #C99D55);
      width: 24px; 
      height: 24px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 4px 12px rgba(217,175,107,0.3), 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
      transform: scale(1);
      transition: transform 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const createEndIcon = () => {
  return L.divIcon({
    className: 'end-marker-icon',
    html: `<div style="
      background: linear-gradient(135deg, #68855C, #536A4A);
      width: 24px; 
      height: 24px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 4px 12px rgba(104,133,92,0.3), 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
      transform: scale(1);
      transition: transform 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const createWaypointIcon = (index: number) => {
  return L.divIcon({
    className: 'waypoint-marker-icon',
    html: `<div style="
      background: linear-gradient(135deg, #526A83, #42556A);
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 4px 12px rgba(82,106,131,0.3), 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
      transform: scale(1);
      transition: transform 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: white;
    ">
      ${index + 1}
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export const getBoundsFromCities = (cities: City[]): L.LatLngBounds => {
  const bounds = L.latLngBounds([]);
  cities.forEach(city => {
    bounds.extend([city.lat, city.lng]);
  });
  return bounds;
};

 