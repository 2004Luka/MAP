import { IoMdTrash, IoMdSearch, IoMdResize } from 'react-icons/io';
import type { City } from '../types';

interface MapControlsProps {
  selectedCities: City[];
  onClearMarkings: () => void;
  onZoomToSelected: () => void;
  onZoomToAll: () => void;
  cities: City[];
}

export const MapControls = ({
  selectedCities,
  onClearMarkings,
  onZoomToSelected,
  onZoomToAll,
  cities
}: MapControlsProps) => {
  const hasSelectedCities = selectedCities.length > 0;
  const hasMultipleCities = cities.length > 0;

  return (
    <div className="absolute top-20 right-5 z-[1000] flex flex-col gap-2">
      {/* Clear Markings Button */}
      <button
        onClick={onClearMarkings}
        disabled={!hasSelectedCities}
        className="glass p-3 rounded-lg hover:bg-white/90 transition-all duration-200 transform hover:scale-110 active:scale-95 bg-white text-secondary-900 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 group"
        title="Clear all selected cities"
        aria-label="Clear markings"
      >
        <IoMdTrash className="w-6 h-6 group-hover:text-red-500 transition-colors" />
      </button>

      {/* Zoom to Selected Button */}
      <button
        onClick={onZoomToSelected}
        disabled={!hasSelectedCities}
        className="glass p-3 rounded-lg hover:bg-white/90 transition-all duration-200 transform hover:scale-110 active:scale-95 bg-white text-secondary-900 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 group"
        title="Zoom to selected cities"
        aria-label="Zoom to selected"
      >
        <IoMdSearch className="w-6 h-6 group-hover:text-blue-500 transition-colors" />
      </button>

      {/* Zoom to All Button */}
      <button
        onClick={onZoomToAll}
        disabled={!hasMultipleCities}
        className="glass p-3 rounded-lg hover:bg-white/90 transition-all duration-200 transform hover:scale-110 active:scale-95 bg-white text-secondary-900 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 group"
        title="Zoom out to see all cities"
        aria-label="Zoom to all cities"
      >
        <IoMdResize className="w-6 h-6 group-hover:text-green-500 transition-colors" />
      </button>
    </div>
  );
}; 