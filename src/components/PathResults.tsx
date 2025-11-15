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
      <div className="bg-gradient-to-br from-primary-50 to-primary-100/30 text-primary-900 border-2 border-primary-200/50 rounded-xl p-5 space-y-4 dark:from-primary-900/20 dark:to-primary-900/10 dark:text-neutral-50 dark:border-primary-700/50 shadow-lg">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse dark:bg-primary-400"></div>
          <h3 className="font-bold text-lg text-primary-900 dark:text-primary-100">Path Results</h3>
        </div>
        <div className="space-y-3.5">
          {algorithmType === 'iddfs' && (
            <div className="flex items-center justify-between p-3 bg-bg-card/60 dark:bg-neutral-800/40 rounded-lg">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-semibold text-primary-800 dark:text-primary-200">Total Distance:</span>
              </div>
              <span className="text-sm font-bold text-primary-900 dark:text-primary-100">{formatDistance(totalDistance)}</span>
            </div>
          )}
          {algorithmType === 'astar' && roadDistance > 0 && (
            <div className="flex items-center justify-between p-3 bg-bg-card/60 dark:bg-neutral-800/40 rounded-lg">
              <div className="flex items-center gap-2.5">
                <Route className="w-4 h-4 text-success-500 dark:text-success-400" />
                <span className="text-sm font-semibold text-success-700 dark:text-success-300">Road Distance:</span>
              </div>
              <span className="text-sm font-bold text-success-800 dark:text-success-200">{formatDistance(roadDistance)}</span>
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-bg-card/60 dark:bg-neutral-800/40 rounded-lg">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-warning-500 dark:text-warning-400" />
              <span className="text-sm font-semibold text-warning-700 dark:text-warning-300">Estimated Time:</span>
            </div>
            <span className="text-sm font-bold text-warning-800 dark:text-warning-200">{formatTime(calculateEstimatedTime(totalDistance))}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-bg-card/60 dark:bg-neutral-800/40 rounded-lg">
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4 text-text-muted dark:text-neutral-400" />
              <span className="text-sm font-semibold text-text-body dark:text-neutral-400">Nodes Explored:</span>
            </div>
            <span className="text-sm font-bold text-text-header dark:text-neutral-300">{nodesExplored.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
