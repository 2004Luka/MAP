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
  isSidebarOpen?: boolean;
  onCloseSidebar?: () => void;
}

export const PathfindingControls = ({
  onPathFound,
  onAlgorithmChange,
  cities,
  algorithmType,
  totalDistance,
  roadDistance,
  nodesExplored,
  isSidebarOpen = false,
  onCloseSidebar
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
    
    // Close sidebar on mobile after finding path
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  const handleClear = () => {
    setStartCity(null);
    setEndCity(null);
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block absolute top-1 z-[1000] animate-fade-in">
        <div className="card p-6 w-96 max-w-[calc(100vw-3rem)] bg-white text-secondary-900 border border-secondary-100 dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center pb-4 border-b border-secondary-100 dark:border-gray-600">
              <h1 className="text-2xl font-bold text-secondary-900 mb-1 dark:text-white">GeoRoutes</h1>
              <p className="text-sm text-secondary-600 dark:text-gray-300">Find optimal paths between cities</p>
            </div>

            {/* City Selection */}
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
            </div>

            {/* Algorithm Selection */}
            <div className="animate-slide-up">
              <AlgorithmSelect
                value={algorithmType}
                onChange={onAlgorithmChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleFindPath}
                disabled={!startCity || !endCity}
                className="btn-primary flex-1"
              >
                Find Path
              </button>
              <button
                onClick={handleClear}
                className="btn-secondary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Clear
              </button>
            </div>

            {/* Results */}
            <div className="animate-slide-up">
              <PathResults
                algorithmType={algorithmType}
                totalDistance={totalDistance}
                roadDistance={roadDistance}
                nodesExplored={nodesExplored}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-full max-w-xs sm:max-w-[85vw] z-[1002] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white text-secondary-900 border-secondary-200 dark:bg-gray-800 dark:text-white dark:border-gray-600`}
      >
        <div className="h-full shadow-2xl overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Mobile Header */}
            <div className="text-center pb-4 border-b border-secondary-100 dark:border-gray-600">
              <h1 className="text-2xl font-bold text-secondary-900 mb-1 dark:text-white">GeoRoutes</h1>
              <p className="text-sm text-secondary-600 dark:text-gray-300">Find optimal paths between cities</p>
            </div>

            {/* City Selection */}
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
            </div>

            {/* Algorithm Selection */}
            <div className="animate-slide-up">
              <AlgorithmSelect
                value={algorithmType}
                onChange={onAlgorithmChange}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleFindPath}
                disabled={!startCity || !endCity}
                className="btn-primary flex-1"
              >
                Find Path
              </button>
              <button
                onClick={handleClear}
                className="btn-secondary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Results Panel */}
      {totalDistance > 0 ? (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1001] w-full border-t shadow-lg mobile-results-panel bg-white text-secondary-900 border-secondary-200 dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <div className="p-4">
            <PathResults
              algorithmType={algorithmType}
              totalDistance={totalDistance}
              roadDistance={roadDistance}
              nodesExplored={nodesExplored}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}; 