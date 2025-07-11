import type { Graph, Heuristic, PathfindingResult } from '../types';
import { calculatePathDistance } from '../utils/pathfinding';


interface AStarNode {
  city: string;
  g: number;  
  h: number; 
  f: number; 
  parent: AStarNode | null;
}

const findLowestFScoreNode = (openSet: AStarNode[]): number => {
  let lowestIndex = 0;
  for (let i = 1; i < openSet.length; i++) {
    if (openSet[i].f < openSet[lowestIndex].f) {
      lowestIndex = i;
    }
  }
  return lowestIndex;
};

const reconstructPath = (goalNode: AStarNode): string[] => {
  const path: string[] = [];
  let current: AStarNode | null = goalNode;
  
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
  const openSet: AStarNode[] = [];
  const closedSet = new Set<string>();
  const nodesExplored = new Set<string>();

  const startNode: AStarNode = {
    city: start,
    g: 0,
    h: heuristic[start],
    f: heuristic[start],
    parent: null
  };
  openSet.push(startNode);

  while (openSet.length > 0) {
    const currentIndex = findLowestFScoreNode(openSet);
    const currentNode = openSet[currentIndex];
    
    nodesExplored.add(currentNode.city);

    if (currentNode.city === goal) {
      return {
        path: reconstructPath(currentNode),
        distance: currentNode.g,
        nodesExplored: nodesExplored.size,
        algorithm: 'astar'
      };
    }

    openSet.splice(currentIndex, 1);
    closedSet.add(currentNode.city);

    for (const neighborCity in graph[currentNode.city]) {
      if (closedSet.has(neighborCity)) continue;

      const tentativeGScore = currentNode.g + graph[currentNode.city][neighborCity];
      const heuristicScore = heuristic[neighborCity];
      const totalScore = tentativeGScore + heuristicScore;

      const existingNode = openSet.find(node => node.city === neighborCity);
      if (existingNode && existingNode.g <= tentativeGScore) continue;

      openSet.push({
        city: neighborCity,
        g: tentativeGScore,
        h: heuristicScore,
        f: totalScore,
        parent: currentNode
      });
    }
  }

  return {
    path: [],
    distance: 0,
    nodesExplored: nodesExplored.size,
    algorithm: 'astar'
  };
};


interface IDDFSNode {
  city: string;
  depth: number;
  parent: IDDFSNode | null;
}

const depthLimitedSearch = (
  graph: Graph,
  currentCity: string,
  goalCity: string,
  remainingDepth: number,
  visited: Set<string>,
  nodesExplored: Set<string>,
  parentNode: IDDFSNode | null = null
): IDDFSNode | null => {
  if (currentCity === goalCity) {
    return { 
      city: currentCity, 
      depth: remainingDepth, 
      parent: parentNode 
    };
  }

  if (remainingDepth === 0) {
    return null;
  }

  visited.add(currentCity);
  nodesExplored.add(currentCity);

  const currentNode: IDDFSNode = {
    city: currentCity,
    depth: remainingDepth,
    parent: parentNode
  };

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



const reconstructIDDFSPath = (goalNode: IDDFSNode): string[] => {
  const path: string[] = [];
  let current: IDDFSNode | null = goalNode;
  
  while (current) {
    path.unshift(current.city);
    current = current.parent;
  }
  
  return path;
};

export const iddfs = (
  graph: Graph,
  start: string,
  goal: string
): PathfindingResult => {
  const nodesExplored = new Set<string>();
  const maxDepth = Object.keys(graph).length;

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

  return {
    path: [],
    distance: 0,
    nodesExplored: nodesExplored.size,
    algorithm: 'iddfs'
  };
};