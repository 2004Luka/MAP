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
    <div className="mt-4 space-y-2">
      {algorithmType == 'iddfs' && (
        <div className="text-sm">
          <span className="font-medium">Total Distance:</span>{' '}
          {formatDistance(totalDistance)}
        </div>
      )}
      {algorithmType === 'astar' && roadDistance > 0 && (
        <div className="text-sm">
          <span className="font-medium">Road Distance:</span>{' '}
          {formatDistance(roadDistance)}
        </div>
      )}
      <div className="text-sm">
        <span className="font-medium">Estimated Time:</span>{' '}
        {formatTime(calculateEstimatedTime(totalDistance))}
      </div>
      <div className="text-sm">
        <span className="font-medium">Nodes Explored:</span>{' '}
        {nodesExplored}
      </div>
    </div>
  );
}; 