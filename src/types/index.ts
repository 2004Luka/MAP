export interface City {
  name: string;
  lat: number;
  lng: number;
  region?: string;
}

export interface Graph {
  [key: string]: { [key: string]: number };
}

export interface Heuristic {
  [key: string]: number;
}

export type AlgorithmType = 'astar' | 'iddfs';

export interface PathfindingResult {
  path: string[];
  distance: number;
  nodesExplored: number;
  algorithm: AlgorithmType;
}

export interface SharedRoute {
  startCity: string;
  endCity: string;
  algorithm: AlgorithmType;
  path: string[];
  totalDistance: number;
  roadDistance: number;
  nodesExplored: number;
  timestamp: number;
}

export interface RouteAnimationState {
  isAnimating: boolean;
  progress: number;
  currentSegment: number;
  totalSegments: number;
} 