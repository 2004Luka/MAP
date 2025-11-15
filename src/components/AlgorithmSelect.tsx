import { ChevronDown } from 'lucide-react';
import type { AlgorithmType } from '../types';

interface AlgorithmSelectProps {
  value: AlgorithmType;
  onChange: (algorithm: AlgorithmType) => void;
}

export const AlgorithmSelect = ({ value, onChange }: AlgorithmSelectProps) => {
  return (
    <div className="animate-slide-up">
      <label className="block text-sm font-semibold text-text-header mb-2.5 dark:text-neutral-300">
        Algorithm
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as AlgorithmType)}
          className="input-field appearance-none cursor-pointer pr-10 font-medium"
        >
          <option value="astar">A* Search</option>
          <option value="iddfs">Iterative Deepening DFS</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-text-muted dark:text-neutral-400" />
        </div>
      </div>
    </div>
  );
};
