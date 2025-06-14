import { useState } from 'react';
import type { City, AlgorithmType } from '../types';
import { createGraph, createHeuristic } from '../utils/pathfinding';
import { astar, iddfs } from '../algorithms/pathfinding';
import { CitySearch } from './CitySearch';
import { AlgorithmSelect } from './AlgorithmSelect';
import { PathResults } from './PathResults';

interface PathfindingControlsProps {
  onPathFound: (path: string[], explored: number, algorithm: AlgorithmType) => void;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  cities: City[];
  algorithmType: AlgorithmType;
  totalDistance: number;
  roadDistance: number;
  nodesExplored: number;
}

export const PathfindingControls = ({
  onPathFound,
  onAlgorithmChange,
  cities,
  algorithmType,
  totalDistance,
  roadDistance,
  nodesExplored
}: PathfindingControlsProps) => {
  const [startCity, setStartCity] = useState<City | null>(null);
  const [endCity, setEndCity] = useState<City | null>(null);

  const handleFindPath = () => {
    if (!startCity || !endCity) return;

    const graph = createGraph(cities);
    const heuristic = createHeuristic(cities, endCity.name);

    let result;
    if (algorithmType === 'astar') {
      result = astar(graph, heuristic, startCity.name, endCity.name);
    } else {
      result = iddfs(graph, startCity.name, endCity.name);
    }

    onPathFound(result.path, result.nodesExplored, result.algorithm);
  };

  const handleClear = () => {
    setStartCity(null);
    setEndCity(null);
  };

  return (
    <div className="absolute top-0 left-0 z-[1000] bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg w-80">
      <div className="space-y-4">
        <CitySearch
          label="Start City"
          onCitySelect={setStartCity}
          onCityRemove={() => setStartCity(null)}
          selectedCity={startCity}
          cities={cities}
        />

        <CitySearch
          label="End City"
          onCitySelect={setEndCity}
          onCityRemove={() => setEndCity(null)}
          selectedCity={endCity}
          cities={cities}
        />

        <AlgorithmSelect
          value={algorithmType}
          onChange={onAlgorithmChange}
        />

        <div className="flex gap-2">
          <button
            onClick={handleFindPath}
            disabled={!startCity || !endCity}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find Path
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
        </div>

        <PathResults
          algorithmType={algorithmType}
          totalDistance={totalDistance}
          roadDistance={roadDistance}
          nodesExplored={nodesExplored}
        />
      </div>
    </div>
  );
}; 