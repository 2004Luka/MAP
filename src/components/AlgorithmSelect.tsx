import type { AlgorithmType } from '../types';

interface AlgorithmSelectProps {
  value: AlgorithmType;
  onChange: (algorithm: AlgorithmType) => void;
}

export const AlgorithmSelect = ({ value, onChange }: AlgorithmSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Algorithm
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AlgorithmType)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="astar">A* Search</option>
        <option value="iddfs">Iterative Deepening DFS</option>
      </select>
    </div>
  );
}; 