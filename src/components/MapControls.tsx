import { Trash2, ZoomIn, Maximize2 } from 'lucide-react';
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
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
      {/* Clear Markings Button */}
      <button
        onClick={onClearMarkings}
        disabled={!hasSelectedCities}
        className="glass p-3.5 rounded-xl hover:bg-bg-card/95 transition-all duration-200 transform hover:scale-110 active:scale-95 text-text-body dark:text-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 group shadow-lg hover:shadow-xl"
        title="Clear all selected cities"
        aria-label="Clear markings"
      >
        <Trash2 className="w-5 h-5 group-hover:text-warning-500 transition-colors" />
      </button>

      {/* Zoom to Selected Button */}
      <button
        onClick={onZoomToSelected}
        disabled={!hasSelectedCities}
        className="glass p-3.5 rounded-xl hover:bg-bg-card/95 transition-all duration-200 transform hover:scale-110 active:scale-95 text-text-body dark:text-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 group shadow-lg hover:shadow-xl"
        title="Zoom to selected cities"
        aria-label="Zoom to selected"
      >
        <ZoomIn className="w-5 h-5 group-hover:text-primary transition-colors" />
      </button>

      {/* Zoom to All Button */}
      <button
        onClick={onZoomToAll}
        disabled={!hasMultipleCities}
        className="glass p-3.5 rounded-xl hover:bg-bg-card/95 transition-all duration-200 transform hover:scale-110 active:scale-95 text-text-body dark:text-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 group shadow-lg hover:shadow-xl"
        title="Zoom out to see all cities"
        aria-label="Zoom to all cities"
      >
        <Maximize2 className="w-5 h-5 group-hover:text-success-500 transition-colors" />
      </button>
    </div>
  );
};
