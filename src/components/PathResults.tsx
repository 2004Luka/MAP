import { MapPin, Route, Clock, Network } from 'lucide-react';
import type { AlgorithmType } from '../types';
import { formatDistance, formatTime, calculateEstimatedTime } from '../utils/pathfinding';

interface PathResultsProps {
  algorithmType: AlgorithmType;
  totalDistance: number;
  roadDistance: number;
  nodesExplored: number;
}

export const PathResults = ({
  algorithmType,
  totalDistance,
  roadDistance,
  nodesExplored
}: PathResultsProps) => {
  if (totalDistance <= 0) return null;

  return (
    <div className="animate-bounce-in">
      <div className="backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-strong dark:shadow-strong-dark w-80">
        <div className="flex items-center gap-3 mb-5 border-b border-gray-100 dark:border-neutral-800 pb-4">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse shadow-lg shadow-primary-500/50"></div>
          <h3 className="font-bold text-lg text-text-header tracking-tight">Path Analysis</h3>
        </div>
        <div className="space-y-4">
          {algorithmType === 'iddfs' && (
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3 text-text-muted group-hover:text-primary-600 transition-colors">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Total Distance</span>
              </div>
              <span className="text-sm font-bold text-text-header font-mono">{formatDistance(totalDistance)}</span>
            </div>
          )}
          {algorithmType === 'astar' && roadDistance > 0 && (
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3 text-text-muted group-hover:text-success-600 transition-colors">
                <Route className="w-4 h-4" />
                <span className="text-sm font-medium">Road Distance</span>
              </div>
              <span className="text-sm font-bold text-text-header font-mono">{formatDistance(roadDistance)}</span>
            </div>
          )}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 text-text-muted group-hover:text-warning-600 transition-colors">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Est. Time</span>
            </div>
            <span className="text-sm font-bold text-text-header font-mono">{formatTime(calculateEstimatedTime(totalDistance))}</span>
          </div>
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 text-text-muted group-hover:text-info-600 transition-colors">
              <Network className="w-4 h-4" />
              <span className="text-sm font-medium">Nodes Visited</span>
            </div>
            <span className="text-sm font-bold text-text-header font-mono">{nodesExplored.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
