import { useState, useEffect } from 'react';
import { Share2, Navigation } from 'lucide-react';
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

  useEffect(() => {
    if (path.length > 0 && startCity && endCity) {
      let calculatedDistance = totalDistance;
      let calculatedRoadDistance = roadDistance;
      
      if (path.length > 0 && totalDistance === 0) {
        const graph = createGraph(cities);
        calculatedDistance = calculatePathDistance(path, graph);
        calculatedRoadDistance = 0;
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
    
    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  const handleClear = () => {
    setCurrentRoute(null);
    if (selectedCities.length > 0) {
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-4 left-4 z-[1000] animate-fade-in">
        <div className="card p-8 w-[420px] max-w-[calc(100vw-2rem)] overflow-y-auto sidebar-scroll" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
          <div className="space-y-8">
            {/* Header */}
            <div className="text-left pb-6 border-b border-border-light dark:border-neutral-700/60">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">
                GeoRoutes
              </h1>
              <p className="text-sm text-text-muted dark:text-neutral-400 font-medium">
                Find optimal paths between cities
              </p>
            </div>

            {/* City Selection */}
            <div className="space-y-5">
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
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Find Path
              </button>
              <button
                onClick={handleClear}
                className="btn-secondary px-4"
                aria-label="Clear selection"
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
                <div className="mt-6 pt-6 border-t border-border-light dark:border-neutral-700/60">
                  <button
                    onClick={handleShareRoute}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
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
        } bg-bg-card/95 backdrop-blur-xl text-text-body border-r border-border-light/50 dark:bg-neutral-800/95 dark:text-neutral-50 dark:border-neutral-700/50 shadow-2xl`}
      >
        <div className="h-full overflow-y-auto sidebar-scroll">
          <div className="p-6 space-y-6">
            {/* Mobile Header */}
            <div className="text-left pb-6 border-b border-border-light dark:border-neutral-700/60">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-2">
                GeoRoutes
              </h1>
              <p className="text-sm text-text-muted dark:text-neutral-400 font-medium">
                Find optimal paths between cities
              </p>
            </div>

            {/* City Selection */}
            <div className="space-y-5">
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
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Find Path
              </button>
              <button
                onClick={handleClear}
                className="btn-secondary px-4"
                aria-label="Clear selection"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Results Panel */}
      {totalDistance > 0 ? (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1001] w-full border-t border-border-light/50 shadow-2xl mobile-results-panel bg-bg-card/95 backdrop-blur-xl text-text-body dark:bg-neutral-800/95 dark:text-neutral-50 dark:border-neutral-700/50">
          <div className="p-5">
            <PathResults
              algorithmType={algorithmType}
              totalDistance={totalDistance}
              roadDistance={roadDistance}
              nodesExplored={nodesExplored}
            />
            
            {/* Mobile Share Button */}
            {currentRoute && (
              <div className="mt-5 pt-5 border-t border-border-light dark:border-neutral-700/60">
                <button
                  onClick={handleShareRoute}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
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
