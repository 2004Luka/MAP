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

export const getBoundsFromCities = (cities: City[]): L.LatLngBounds => {
  const bounds = L.latLngBounds([]);
  cities.forEach(city => {
    bounds.extend([city.lat, city.lng]);
  });
  return bounds;
};

 