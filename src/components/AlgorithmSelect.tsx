import type { AlgorithmType } from '../types';

interface AlgorithmSelectProps {
  value: AlgorithmType;
  onChange: (algorithm: AlgorithmType) => void;
  isDark: boolean;
}

export const AlgorithmSelect = ({ value, onChange, isDark }: AlgorithmSelectProps) => {
  const getThemeClasses = (baseClasses: string, darkClasses: string) => {
    return `${baseClasses} ${isDark ? `${darkClasses} dark` : ''}`;
  };

  return (
    <div className="animate-slide-up">
      <label className="block text-sm font-semibold text-secondary-700 mb-2 dark:text-gray-300">
        Algorithm
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as AlgorithmType)}
          className="input-field bg-white text-secondary-900 border border-secondary-200 appearance-none cursor-pointer pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option value="astar">A* Search</option>
          <option value="iddfs">Iterative Deepening DFS</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-secondary-400 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}; 