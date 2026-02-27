import { describe, it, expect } from 'vitest';
import { astar, dijkstra, bfs, dfs } from './pathfinding';
import { createGraph, createHeuristic } from '../utils/pathfinding';
import { cities } from '../data/cities';

describe('Pathfinding Algorithms', () => {
    const graph = createGraph(cities);
    const startCity = 'Tbilisi';
    const endCity = 'Batumi'; // Far away

    it('A* should find a path', () => {
        const heuristic = createHeuristic(cities, endCity);
        const result = astar(graph, heuristic, startCity, endCity);
        expect(result.path.length).toBeGreaterThan(0);
        expect(result.path[0]).toBe(startCity);
        expect(result.path[result.path.length - 1]).toBe(endCity);
        expect(result.visitedOrder).toBeDefined();
        expect(result.visitedOrder?.length).toBeGreaterThan(0);
    });

    it('Dijkstra should find the shortest path (same distance as A*)', () => {
        const heuristic = createHeuristic(cities, endCity);
        const astarResult = astar(graph, heuristic, startCity, endCity);
        const dijkstraResult = dijkstra(graph, startCity, endCity);

        expect(dijkstraResult.path.length).toBeGreaterThan(0);
        // Floating point precision might vary slightly but distance should be very close
        expect(Math.abs(dijkstraResult.distance - astarResult.distance)).toBeLessThan(0.1);
    });

    it('BFS should find a path with least hops (unweighted logic, but on weighted graph it finds A path)', () => {
        const result = bfs(graph, startCity, endCity);
        expect(result.path.length).toBeGreaterThan(0);
        // BFS on explicit connections might find a path with more distance but fewer nodes? 
        // Or just a valid path.
        expect(result.path[0]).toBe(startCity);
        expect(result.path[result.path.length - 1]).toBe(endCity);
    });

    it('DFS should find a path', () => {
        const result = dfs(graph, startCity, endCity);
        expect(result.path.length).toBeGreaterThan(0);
        expect(result.path[0]).toBe(startCity);
        expect(result.path[result.path.length - 1]).toBe(endCity);
    });

    it('Should handle unreachable cities gracefully', () => {
        // Create a disconnected graph
        const disconnectedGraph = {
            'A': { 'B': 10 },
            'B': { 'A': 10 },
            'C': { 'D': 10 },
            'D': { 'C': 10 }
        };

        const heuristic = { 'A': 100, 'B': 100, 'C': 0, 'D': 0 }; // Dummy heuristic

        const result = astar(disconnectedGraph, heuristic, 'A', 'C');
        expect(result.path.length).toBe(0);
        expect(result.distance).toBe(0);
    });
});
