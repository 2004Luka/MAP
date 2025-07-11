import { useState, useEffect } from 'react';
import type { City, AlgorithmType, SharedRoute } from '../types';
import { createGraph, createHeuristic, calculatePathDistance } from '../utils/pathfinding';
import { astar, iddfs } from '../algorithms/pathfinding';
import { CitySearch } from './CitySearch';
import { AlgorithmSelect } from './AlgorithmSelect';
import { PathResults } from './PathResults';
import { RouteSharing } from './RouteSharing';

interface PathfindingControlsProps {
  onPathFound: (path: string[], explored: number, algorithm: AlgorithmType) => void;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  cities: City[];
  algorithmType: AlgorithmType;
  totalDistance: number;
  roadDistance: number;
  nodesExplored: number;
  path: string[];
  isSidebarOpen?: boolean;
  onCloseSidebar?: () => void;
  selectedCities: City[];
  onCitySelect: (city: City) => void;
}

export const PathfindingControls = ({
  onPathFound,
  onAlgorithmChange,
  cities,
  algorithmType,
  totalDistance,
  roadDistance,
  nodesExplored,
  path,
  isSidebarOpen = false,
  onCloseSidebar,
  selectedCities,
  onCitySelect
}: PathfindingControlsProps) => {
  const [showSharing, setShowSharing] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<SharedRoute | null>(null);

  const startCity = selectedCities[0] || null;
  const endCity = selectedCities[1] || null;

  // Update currentRoute when path and distances change
  useEffect(() => {
    if (path.length > 0 && startCity && endCity) {
      // Calculate the actual distance for the current path
      let calculatedDistance = totalDistance;
      let calculatedRoadDistance = roadDistance;
      
      // If we have a path but no distance, calculate it
      if (path.length > 0 && totalDistance === 0) {
        const graph = createGraph(cities);
        calculatedDistance = calculatePathDistance(path, graph);
        calculatedRoadDistance = 0; // For non-A* algorithms
      }
      
      const sharedRoute: SharedRoute = {
        startCity: startCity.name,
        endCity: endCity.name,
        algorithm: algorithmType,
        path: path,
        totalDistance: calculatedDistance,
        roadDistance: calculatedRoadDistance,
        nodesExplored: nodesExplored,
        timestamp: Date.now()
      };
      setCurrentRoute(sharedRoute);
    } else {
      setCurrentRoute(null);
    }
  }, [path, totalDistance, roadDistance, nodesExplored, startCity, endCity, algorithmType, cities]);

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
    
    // Create shared route data
    const sharedRoute: SharedRoute = {
      startCity: startCity.name,
      endCity: endCity.name,
      algorithm: algorithmType,
      path: result.path,
      totalDistance: totalDistance,
      roadDistance: roadDistance,
      nodesExplored: result.nodesExplored,
      timestamp: Date.now()
    };
    setCurrentRoute(sharedRoute);
    
    // Close sidebar on mobile after finding path
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  const handleClear = () => {
    setCurrentRoute(null);
    // Clear the selected cities in the parent component
    if (selectedCities.length > 0) {
      // This will trigger the parent to clear the selection
      onCitySelect(selectedCities[0]);
    }
  };

  const handleShareRoute = () => {
    if (currentRoute) {
      setShowSharing(true);
    }
  };

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
  };

  const handleStartCityRemove = () => {
    if (selectedCities.length > 0) {
      onCitySelect(selectedCities[0]);
    }
  };

  const handleEndCityRemove = () => {
    if (selectedCities.length > 1) {
      onCitySelect(selectedCities[0]);
    }
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block absolute top-1 z-[1000] animate-fade-in">
        <div className="card p-6 w-96 max-w-[calc(100vw-3rem)] bg-white text-secondary-900 border border-secondary-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 overflow-y-auto sidebar-scroll dark:sidebar-scroll" style={{ maxHeight: 'calc(100vh - 0.5rem)' }}>
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
                onCitySelect={handleCitySelect}
                onCityRemove={handleStartCityRemove}
                selectedCity={startCity}
                cities={cities}
              />

              <CitySearch
                label="End City"
                onCitySelect={handleCitySelect}
                onCityRemove={handleEndCityRemove}
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
              
              {/* Share Button */}
              {currentRoute && totalDistance > 0 && (
                <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-gray-600">
                  <button
                    onClick={handleShareRoute}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Route
                  </button>
                </div>
              )}
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
        <div className="h-full shadow-2xl overflow-y-auto sidebar-scroll dark:sidebar-scroll">
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
                onCitySelect={handleCitySelect}
                onCityRemove={handleStartCityRemove}
                selectedCity={startCity}
                cities={cities}
              />

              <CitySearch
                label="End City"
                onCitySelect={handleCitySelect}
                onCityRemove={handleEndCityRemove}
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
            
            {/* Mobile Share Button */}
            {currentRoute && (
              <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-gray-600">
                <button
                  onClick={handleShareRoute}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Route
                </button>
              </div>
            )}
            
          </div>
        </div>
      ) : null}

      {/* Route Sharing Modal */}
      {showSharing && currentRoute && (
        <RouteSharing
          route={currentRoute}
          onClose={() => setShowSharing(false)}
        />
      )}
    </>
  );
}; 