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
      <div className="bg-primary-50 text-primary-900 border border-primary-200 rounded-lg p-4 space-y-3 dark:bg-gray-800 dark:text-white dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-primary-500 rounded-full dark:bg-primary-400"></div>
          <h3 className="font-semibold text-primary-900 dark:text-primary-100">Path Results</h3>
        </div>
        <div className="space-y-2.5">
          {algorithmType === 'iddfs' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-sm font-medium text-primary-800 dark:text-primary-200">Total Distance:</span>
              </div>
              <span className="text-sm font-semibold text-primary-900 dark:text-primary-100">{formatDistance(totalDistance)}</span>
            </div>
          )}
          {algorithmType === 'astar' && roadDistance > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm font-medium text-success-800 dark:text-green-200">Road Distance:</span>
              </div>
              <span className="text-sm font-semibold text-success-900 dark:text-green-100">{formatDistance(roadDistance)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-warning-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-warning-800 dark:text-yellow-200">Estimated Time:</span>
            </div>
            <span className="text-sm font-semibold text-warning-900 dark:text-yellow-100">{formatTime(calculateEstimatedTime(totalDistance))}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-secondary-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium text-secondary-800 dark:text-gray-300">Nodes Explored:</span>
            </div>
            <span className="text-sm font-semibold text-secondary-900 dark:text-gray-200">{nodesExplored.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 