import { useState } from 'react';

interface Graph {
  [key: string]: { [key: string]: number };
}

interface Heuristic {
  [key: string]: number;
}

interface PathfindingControlsProps {
  onPathFound: (path: string[], totalDistance: number, nodesExplored: number, algorithmType: 'astar' | 'iddfs') => void;
  cities: { name: string; lat: number; lng: number }[];
}

export function PathfindingControls({ onPathFound, cities }: PathfindingControlsProps) {
  const [startCity, setStartCity] = useState('');
  const [endCity, setEndCity] = useState('');
  const [algorithm, setAlgorithm] = useState<'astar' | 'iddfs'>('astar');
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [nodesExplored, setNodesExplored] = useState<number>(0);

  // Create a graph from the cities (using straight-line distances)
  const createGraph = (): Graph => {
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

  // Calculate straight-line distance between two points
  const calculateDistance = (city1: { lat: number; lng: number }, city2: { lat: number; lng: number }): number => {
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

  // Create heuristic (straight-line distance to goal)
  const createHeuristic = (goal: string): Heuristic => {
    const heuristic: Heuristic = {};
    const goalCity = cities.find(city => city.name === goal);
    if (!goalCity) return heuristic;

    cities.forEach(city => {
      heuristic[city.name] = calculateDistance(city, goalCity);
    });
    return heuristic;
  };

  // A* Search implementation
  const aStarSearch = (graph: Graph, heuristic: Heuristic, start: string, goal: string): [string[] | null, number, number] => {
    let nodesExplored = 0;
    const queue: [number, number, string, string[]][] = [[heuristic[start], 0, start, [start]]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      nodesExplored++;
      queue.sort((a, b) => a[0] - b[0]); // Sort by priority
      const [_, currentCost, currentNode, currentPath] = queue.shift()!;

      if (currentNode === goal) {
        return [currentPath, currentCost, nodesExplored];
      }

      if (visited.has(currentNode)) continue;
      visited.add(currentNode);

      for (const [neighbor, distance] of Object.entries(graph[currentNode])) {
        const totalCost = currentCost + distance;
        const estimateOverall = totalCost + heuristic[neighbor];
        queue.push([estimateOverall, totalCost, neighbor, [...currentPath, neighbor]]);
      }
    }

    return [null, Infinity, nodesExplored];
  };

  // IDDFS implementation
  const dfsLimited = (
    graph: Graph,
    current: string,
    goal: string,
    depth: number,
    path: string[],
    visited: Set<string>,
    nodeCounter: { count: number }
  ): string[] | null => {
    if (depth < 0) return null;
    if (current === goal) return path;

    visited.add(current);
    nodeCounter.count++;

    for (const neighbor of Object.keys(graph[current])) {
      if (!visited.has(neighbor)) {
        const result = dfsLimited(graph, neighbor, goal, depth - 1, [...path, neighbor], visited, nodeCounter);
        if (result) return result;
      }
    }
    return null;
  };

  const iddfs = (graph: Graph, start: string, goal: string, maxDepth: number): [string[] | null, number, number] => {
    const nodeCounter = { count: 0 };
    for (let depth = 0; depth <= maxDepth; depth++) {
      const visited = new Set<string>();
      const path = dfsLimited(graph, start, goal, depth, [start], visited, nodeCounter);
      if (path) return [path, depth, nodeCounter.count];
    }
    return [null, -1, nodeCounter.count];
  };

  const findPath = () => {
    if (!startCity || !endCity) return;

    const graph = createGraph();
    let path: string[] | null = null;
    let distance = 0;
    let explored = 0;

    if (algorithm === 'astar') {
      const heuristic = createHeuristic(endCity);
      const [foundPath, pathCost, nodesExplored] = aStarSearch(graph, heuristic, startCity, endCity);
      path = foundPath;
      distance = pathCost;
      explored = nodesExplored;
    } else {
      const [foundPath, depth, nodesExplored] = iddfs(graph, startCity, endCity, 10);
      path = foundPath;
      if (path) {
        distance = calculatePathDistance(path, graph);
      }
      explored = nodesExplored;
    }

    if (path) {
      const time = distance / 60; // Assuming average speed of 60 km/h
      setTotalDistance(distance);
      setEstimatedTime(time);
      setNodesExplored(explored);
      onPathFound(path, distance, explored, algorithm);
    } else {
      alert('No path found!');
    }
  };

  const calculatePathDistance = (path: string[], graph: Graph): number => {
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      totalDistance += graph[path[i]][path[i + 1]];
    }
    return totalDistance;
  };

  const formatDistance = (distance: number): string => {
    return `${distance.toFixed(1)} km`;
  };

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (wholeHours === 0) {
      return `${minutes} min`;
    }
    return `${wholeHours}h ${minutes}min`;
  };

  return (
    <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <h2 className="text-lg font-bold mb-4">Pathfinding Controls</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start City</label>
          <select
            value={startCity}
            onChange={(e) => setStartCity(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select start city</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End City</label>
          <select
            value={endCity}
            onChange={(e) => setEndCity(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select end city</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as 'astar' | 'iddfs')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="astar">A* Search</option>
            <option value="iddfs">Iterative Deepening DFS</option>
          </select>
        </div>
        <button
          onClick={findPath}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Find Path
        </button>
        {totalDistance > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between mb-1">
                <span>Total Distance:</span>
                <span className="font-medium">{formatDistance(totalDistance)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Estimated Time:</span>
                <span className="font-medium">{formatTime(estimatedTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nodes Explored:</span>
                <span className="font-medium">{nodesExplored}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 