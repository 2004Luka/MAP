import type { City } from '../types';
import L from 'leaflet';

export const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

export const getBoundsFromCities = (cities: City[]): L.LatLngBounds => {
  const bounds = L.latLngBounds([]);
  cities.forEach(city => {
    bounds.extend([city.lat, city.lng]);
  });
  return bounds;
};

export const getPathColor = (algorithm: string): string => {
  switch (algorithm) {
    case 'astar':
      return '#2563eb'; 
    case 'iddfs':
      return '#16a34a'; 
    default:
      return '#6b7280'; 
  }
};

export const getPathWeight = (algorithm: string): number => {
  switch (algorithm) {
    case 'astar':
      return 4;
    case 'iddfs':
      return 3;
    default:
      return 2;
  }
};

export const getPathOpacity = (algorithm: string): number => {
  switch (algorithm) {
    case 'astar':
      return 0.8;
    case 'iddfs':
      return 0.6;
    default:
      return 0.5;
  }
}; 