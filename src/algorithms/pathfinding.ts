import type { Graph, Heuristic, PathfindingResult } from '../types';
import { calculatePathDistance } from '../utils/pathfinding';

interface Node {
  city: string;
  g: number;
  f: number;
  parent: Node | null;
}

const reconstructPath = (node: Node): string[] => {
  const path: string[] = [];
  let current: Node | null = node;
  while (current) {
    path.unshift(current.city);
    current = current.parent;
  }
  return path;
};

export const astar = (
  graph: Graph,
  heuristic: Heuristic,
  start: string,
  goal: string
): PathfindingResult => {
  const openSet: Node[] = [];
  const closedSet = new Set<string>();
  const visitedOrder: string[] = [];

  openSet.push({
    city: start,
    g: 0,
    f: heuristic[start],
    parent: null
  });

  while (openSet.length > 0) {
    // Find node with lowest f score
    let lowestIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    const current = openSet[lowestIndex];

    // Remove current from openSet
    openSet.splice(lowestIndex, 1);

    if (closedSet.has(current.city)) continue;

    closedSet.add(current.city);
    visitedOrder.push(current.city);

    if (current.city === goal) {
      return {
        path: reconstructPath(current),
        distance: current.g,
        nodesExplored: closedSet.size,
        algorithm: 'astar',
        visitedOrder
      };
    }

    const neighbors = graph[current.city];
    for (const neighbor in neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = current.g + neighbors[neighbor];

      const existingNode = openSet.find(n => n.city === neighbor);
      if (existingNode && tentativeG >= existingNode.g) continue;

      const neighborNode: Node = {
        city: neighbor,
        g: tentativeG,
        f: tentativeG + heuristic[neighbor],
        parent: current
      };

      if (existingNode) {
        existingNode.g = neighborNode.g;
        existingNode.f = neighborNode.f;
        existingNode.parent = neighborNode.parent;
      } else {
        openSet.push(neighborNode);
      }
    }
  }

  return {
    path: [],
    distance: 0,
    nodesExplored: closedSet.size,
    algorithm: 'astar',
    visitedOrder
  };
};

export const dijkstra = (
  graph: Graph,
  start: string,
  goal: string
): PathfindingResult => {
  // Dijkstra is A* with h(n) = 0
  const openSet: Node[] = [];
  const closedSet = new Set<string>();
  const visitedOrder: string[] = [];

  openSet.push({
    city: start,
    g: 0,
    f: 0,
    parent: null
  });

  while (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].g < openSet[lowestIndex].g) { // Compare g score directly
        lowestIndex = i;
      }
    }

    const current = openSet[lowestIndex];
    openSet.splice(lowestIndex, 1);

    if (closedSet.has(current.city)) continue;

    closedSet.add(current.city);
    visitedOrder.push(current.city);

    if (current.city === goal) {
      return {
        path: reconstructPath(current),
        distance: current.g,
        nodesExplored: closedSet.size,
        algorithm: 'dijkstra',
        visitedOrder
      };
    }

    const neighbors = graph[current.city];
    for (const neighbor in neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = current.g + neighbors[neighbor];

      const existingNode = openSet.find(n => n.city === neighbor);
      if (existingNode && tentativeG >= existingNode.g) continue;

      const neighborNode: Node = {
        city: neighbor,
        g: tentativeG,
        f: tentativeG, // f = g
        parent: current
      };

      if (existingNode) {
        existingNode.g = neighborNode.g;
        existingNode.f = neighborNode.f;
        existingNode.parent = neighborNode.parent;
      } else {
        openSet.push(neighborNode);
      }
    }
  }

  return {
    path: [],
    distance: 0,
    nodesExplored: closedSet.size,
    algorithm: 'dijkstra',
    visitedOrder
  };
};

export const bfs = (
  graph: Graph,
  start: string,
  goal: string
): PathfindingResult => {
  const queue: { city: string; parent: any | null }[] = [{ city: start, parent: null }];
  const visited = new Set<string>([start]);
  const visitedOrder: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    visitedOrder.push(current.city);

    if (current.city === goal) {
      const path: string[] = [];
      let curr: any | null = current;
      while (curr) {
        path.unshift(curr.city);
        curr = curr.parent;
      }
      return {
        path,
        distance: calculatePathDistance(path, graph),
        nodesExplored: visited.size,
        algorithm: 'bfs',
        visitedOrder
      };
    }

    const neighbors = Object.keys(graph[current.city] || {});
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ city: neighbor, parent: current });
      }
    }
  }

  return {
    path: [],
    distance: 0,
    nodesExplored: visited.size,
    algorithm: 'bfs',
    visitedOrder
  };
};

export const dfs = (
  graph: Graph,
  start: string,
  goal: string
): PathfindingResult => {
  const stack: { city: string; parent: any | null }[] = [{ city: start, parent: null }];
  const visited = new Set<string>();
  const visitedOrder: string[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current.city)) continue;
    visited.add(current.city);
    visitedOrder.push(current.city);

    if (current.city === goal) {
      const path: string[] = [];
      let curr: any | null = current;
      while (curr) {
        path.unshift(curr.city);
        curr = curr.parent;
      }
      return {
        path,
        distance: calculatePathDistance(path, graph),
        nodesExplored: visited.size,
        algorithm: 'dfs',
        visitedOrder
      };
    }

    const neighbors = Object.keys(graph[current.city] || {});
    // Reverse neighbors to process in a more natural order for visualization if needed,
    // or keep as is. Usually DFS goes deep.
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push({ city: neighbor, parent: current });
      }
    }
  }

  return {
    path: [],
    distance: 0,
    nodesExplored: visited.size,
    algorithm: 'dfs',
    visitedOrder
  };
};

// IDDFS Helper
interface IDDFSNode {
  city: string;
  depth: number;
  parent: IDDFSNode | null;
}

export const iddfs = (
  graph: Graph,
  start: string,
  goal: string
): PathfindingResult => {
  const visitedOrder: string[] = [];

  const depthLimitedSearch = (
    currentCity: string,
    remainingDepth: number,
    visited: Set<string>,
    localVisitedOrder: string[],
    parentNode: IDDFSNode | null
  ): IDDFSNode | null => {
    localVisitedOrder.push(currentCity); // Track visitation

    if (currentCity === goal) {
      return { city: currentCity, depth: remainingDepth, parent: parentNode };
    }

    if (remainingDepth <= 0) return null;

    visited.add(currentCity);

    const neighbors = Object.keys(graph[currentCity] || {});
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const result = depthLimitedSearch(
          neighbor,
          remainingDepth - 1,
          visited,
          localVisitedOrder,
          { city: currentCity, depth: remainingDepth, parent: parentNode }
        );
        if (result) return result;
      }
    }

    visited.delete(currentCity); // Backtrack
    return null;
  };

  const maxDepth = Object.keys(graph).length;

  for (let depth = 0; depth <= maxDepth; depth++) {
    const visited = new Set<string>();
    // Note: IDDFS searches re-visit nodes. We collect all visits.
    const result = depthLimitedSearch(start, depth, visited, visitedOrder, null);

    if (result) {
      const path: string[] = [];
      let curr: IDDFSNode | null = result;
      while (curr) {
        path.unshift(curr.city);
        curr = curr.parent;
      }
      return {
        path,
        distance: calculatePathDistance(path, graph),
        nodesExplored: visitedOrder.length,
        algorithm: 'iddfs',
        visitedOrder: visitedOrder
      };
    }
  }

  return {
    path: [],
    distance: 0,
    nodesExplored: visitedOrder.length,
    algorithm: 'iddfs',
    visitedOrder
  };
};