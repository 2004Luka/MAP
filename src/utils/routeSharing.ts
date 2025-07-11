import type { SharedRoute } from '../types';

export const generateShareableLink = (route: SharedRoute): string => {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    start: route.startCity,
    end: route.endCity,
    algorithm: route.algorithm,
    path: route.path.join(','),
    distance: route.totalDistance.toString(),
    roadDistance: route.roadDistance.toString(),
    nodes: route.nodesExplored.toString(),
    timestamp: route.timestamp.toString()
  });
  
  return `${baseUrl}?${params.toString()}`;
};

export const parseSharedRoute = (searchParams: URLSearchParams): SharedRoute | null => {
  try {
    const startCity = searchParams.get('start');
    const endCity = searchParams.get('end');
    const algorithm = searchParams.get('algorithm') as 'astar' | 'iddfs';
    const path = searchParams.get('path')?.split(',') || [];
    const distance = parseFloat(searchParams.get('distance') || '0');
    const roadDistance = parseFloat(searchParams.get('roadDistance') || '0');
    const nodes = parseInt(searchParams.get('nodes') || '0');
    const timestamp = parseInt(searchParams.get('timestamp') || '0');

    if (!startCity || !endCity || !algorithm) {
      return null;
    }

    return {
      startCity,
      endCity,
      algorithm,
      path,
      totalDistance: distance,
      roadDistance,
      nodesExplored: nodes,
      timestamp
    };
  } catch (error) {
    console.error('Error parsing shared route:', error);
    return null;
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const shareRoute = async (route: SharedRoute): Promise<boolean> => {
  const shareableLink = generateShareableLink(route);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'GeoRoutes - Optimal Path',
        text: `Route from ${route.startCity} to ${route.endCity} using ${route.algorithm.toUpperCase()} algorithm. Distance: ${route.totalDistance.toFixed(2)} km`,
        url: shareableLink
      });
      return true;
    } catch (error) {
      console.error('Error sharing route:', error);
      return false;
    }
  } else {
    // Fallback to clipboard
    return await copyToClipboard(shareableLink);
  }
}; 