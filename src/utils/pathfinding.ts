import type { City, Graph, Heuristic } from '../types';

export const calculateDistance = (city1: City, city2: City): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (city2.lat - city1.lat) * Math.PI / 180;
  const dLon = (city2.lng - city1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(city1.lat * Math.PI / 180) * Math.cos(city2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const createGraph = (cities: City[]): Graph => {
  const graph: Graph = {};
  cities.forEach(city1 => {
    graph[city1.name] = {};
    cities.forEach(city2 => {
      if (city1.name !== city2.name) {
        const distance = calculateDistance(city1, city2);
        graph[city1.name][city2.name] = distance;
      }
    });
  });
  return graph;
};

export const createHeuristic = (cities: City[], goal: string): Heuristic => {
  const heuristic: Heuristic = {};
  const goalCity = cities.find(city => city.name === goal);
  if (!goalCity) return heuristic;

  cities.forEach(city => {
    heuristic[city.name] = calculateDistance(city, goalCity);
  });
  return heuristic;
};

export const calculatePathDistance = (path: string[], graph: Graph): number => {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += graph[path[i]][path[i + 1]];
  }
  return totalDistance;
};

export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(1)} km`;
};

export const formatTime = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  if (wholeHours === 0) {
    return `${minutes} min`;
  }
  return `${wholeHours}h ${minutes}min`;
};

export const calculateEstimatedTime = (distance: number): number => {
  return distance / 60; // Assuming average speed of 60 km/h
}; 