import { CustomSelect } from './CustomSelect';
import type { AlgorithmType } from '../types';

interface AlgorithmSelectProps {
  value: AlgorithmType;
  onChange: (algorithm: AlgorithmType) => void;
}

const ALGORITHM_OPTIONS = [
  { value: 'astar', label: 'A* Search' },
  { value: 'dijkstra', label: "Dijkstra's Algorithm" },
  { value: 'bfs', label: 'Breadth-First Search (BFS)' },
  { value: 'dfs', label: 'Depth-First Search (DFS)' },
  { value: 'iddfs', label: 'Iterative Deepening DFS' },
];

export const AlgorithmSelect = ({ value, onChange }: AlgorithmSelectProps) => {
  return (
    <CustomSelect
      label="Algorithm"
      value={value}
      onChange={(val) => onChange(val as AlgorithmType)}
      options={ALGORITHM_OPTIONS}
    />
  );
};
