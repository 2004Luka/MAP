import type { Graph, Heuristic, AlgorithmType, PathfindingResult } from '../types';

// ===== A* ALGORITHM =====

interface AStarNode {
  city: string;
  g: number;  // Actual cost from start to current node
  h: number;  // Heuristic cost from current node to goal
  f: number;  // Total estimated cost (g + h)
  parent: AStarNode | null;
}

/**
 * Finds the node with the lowest f-score in the open set
 */
const findLowestFScoreNode = (openSet: AStarNode[]): number => {
  let lowestIndex = 0;
  for (let i = 1; i < openSet.length; i++) {
    if (openSet[i].f < openSet[lowestIndex].f) {
      lowestIndex = i;
    }
  }
  return lowestIndex;
};

/**
 * Reconstructs the path from goal back to start
 */
const reconstructPath = (goalNode: AStarNode): string[] => {
  const path: string[] = [];
  let current: AStarNode | null = goalNode;
  
  while (current) {
    path.unshift(current.city);
    current = current.parent;
  }
  
  return path;
};

/**
 * A* pathfinding algorithm - finds optimal path using heuristic guidance
 */
export const astar = (
  graph: Graph,
  heuristic: Heuristic,
  start: string,
  goal: string
): PathfindingResult => {
  const openSet: AStarNode[] = [];
  const closedSet = new Set<string>();
  const nodesExplored = new Set<string>();

  // Initialize starting node
  const startNode: AStarNode = {
    city: start,
    g: 0,
    h: heuristic[start],
    f: heuristic[start],
    parent: null
  };
  openSet.push(startNode);

  while (openSet.length > 0) {
    // Get node with lowest total cost estimate
    const currentIndex = findLowestFScoreNode(openSet);
    const currentNode = openSet[currentIndex];
    
    nodesExplored.add(currentNode.city);

    // Check if we've reached our destination
    if (currentNode.city === goal) {
      return {
        path: reconstructPath(currentNode),
        distance: currentNode.g,
        nodesExplored: nodesExplored.size,
        algorithm: 'astar'
      };
    }

    // Move current node from open to closed set
    openSet.splice(currentIndex, 1);
    closedSet.add(currentNode.city);

    // Explore all neighboring cities
    for (const neighborCity in graph[currentNode.city]) {
      // Skip if already fully explored
      if (closedSet.has(neighborCity)) continue;

      const tentativeGScore = currentNode.g + graph[currentNode.city][neighborCity];
      const heuristicScore = heuristic[neighborCity];
      const totalScore = tentativeGScore + heuristicScore;

      // Check if we already have a better path to this neighbor
      const existingNode = openSet.find(node => node.city === neighborCity);
      if (existingNode && existingNode.g <= tentativeGScore) continue;

      // Add or update neighbor in open set
      openSet.push({
        city: neighborCity,
        g: tentativeGScore,
        h: heuristicScore,
        f: totalScore,
        parent: currentNode
      });
    }
  }

  // No path found
  return {
    path: [],
    distance: 0,
    nodesExplored: nodesExplored.size,
    algorithm: 'astar'
  };
};

// ===== ITERATIVE DEEPENING DEPTH-FIRST SEARCH =====

interface IDDFSNode {
  city: string;
  depth: number;
  parent: IDDFSNode | null;
}

/**
 * Performs depth-limited search from current node
 */
const depthLimitedSearch = (
  graph: Graph,
  currentCity: string,
  goalCity: string,
  remainingDepth: number,
  visited: Set<string>,
  nodesExplored: Set<string>,
  parentNode: IDDFSNode | null = null
): IDDFSNode | null => {
  // Found the goal!
  if (currentCity === goalCity) {
    return { 
      city: currentCity, 
      depth: remainingDepth, 
      parent: parentNode 
    };
  }

  // Reached depth limit
  if (remainingDepth === 0) {
    return null;
  }

  // Mark as visited and explored
  visited.add(currentCity);
  nodesExplored.add(currentCity);

  const currentNode: IDDFSNode = {
    city: currentCity,
    depth: remainingDepth,
    parent: parentNode
  };

  // Explore all unvisited neighbors
  for (const neighborCity in graph[currentCity]) {
    if (!visited.has(neighborCity)) {
      const result = depthLimitedSearch(
        graph,
        neighborCity,
        goalCity,
        remainingDepth - 1,
        visited,
        nodesExplored,
        currentNode
      );
      
      if (result) {
        return result;
      }
    }
  }

  return null;
};

/**
 * Calculates total distance for a given path
 */
const calculatePathDistance = (path: string[], graph: Graph): number => {
  let totalDistance = 0;
  
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += graph[path[i]][path[i + 1]];
  }
  
  return totalDistance;
};

/**
 * Reconstructs path from IDDFS result node
 */
const reconstructIDDFSPath = (goalNode: IDDFSNode): string[] => {
  const path: string[] = [];
  let current: IDDFSNode | null = goalNode;
  
  while (current) {
    path.unshift(current.city);
    current = current.parent;
  }
  
  return path;
};

/**
 * Iterative Deepening Depth-First Search - finds path by gradually increasing search depth
 */
export const iddfs = (
  graph: Graph,
  start: string,
  goal: string
): PathfindingResult => {
  const nodesExplored = new Set<string>();
  const maxDepth = Object.keys(graph).length;

  // Try increasing depths until we find a solution or exhaust possibilities
  for (let currentDepth = 0; currentDepth <= maxDepth; currentDepth++) {
    const visited = new Set<string>();
    const result = depthLimitedSearch(
      graph, 
      start, 
      goal, 
      currentDepth, 
      visited, 
      nodesExplored
    );

    if (result) {
      const path = reconstructIDDFSPath(result);
      const distance = calculatePathDistance(path, graph);

      return {
        path,
        distance,
        nodesExplored: nodesExplored.size,
        algorithm: 'iddfs'
      };
    }
  }

  // No path found
  return {
    path: [],
    distance: 0,
    nodesExplored: nodesExplored.size,
    algorithm: 'iddfs'
  };
};