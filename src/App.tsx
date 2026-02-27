import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import './App.css'
import Map from './Map'
import { PathfindingControls } from './components/PathfindingControls'
import { cities } from './data/cities'
import type { City, AlgorithmType } from './types'
import { calculatePathDistance, createGraph, createHeuristic } from './utils/pathfinding'
import { astar, iddfs, bfs, dfs, dijkstra } from './algorithms/pathfinding'
import { parseSharedRoute } from './utils/routeSharing'

function App() {
  const cookieSettings = Cookies.get('geoSettings')
  const parsedSettings = cookieSettings ? JSON.parse(cookieSettings) : {}

  const [selectedCities, setSelectedCities] = useState<City[]>([])
  const [path, setPath] = useState<string[]>([])
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('astar')
  const [totalDistance, setTotalDistance] = useState<number>(0)
  const [roadDistance, setRoadDistance] = useState<number>(0)
  const [nodesExplored, setNodesExplored] = useState<number>(0)
  const [visitedOrder, setVisitedOrder] = useState<string[]>([])
  const [roadRoute, setRoadRoute] = useState<[number, number][]>([])
  const [mapStyle, setMapStyle] = useState(parsedSettings.mapStyle || 'light_all')
  const [markerStyle, setMarkerStyle] = useState(parsedSettings.markerStyle || { size: 4, color: '#737373' }) // neutral-500
  const [routeStyle, setRouteStyle] = useState(parsedSettings.routeStyle || { weight: 3, color: '#0D9488', opacity: 0.8 }) // primary
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)

  const handleCitySelect = (city: City) => {
    // If no cities are selected, set as start city
    if (selectedCities.length === 0) {
      setSelectedCities([city]);
    }
    // If one city is selected, set as end city
    else if (selectedCities.length === 1) {
      // If clicking the same city, clear it
      if (selectedCities[0].name === city.name) {
        setSelectedCities([]);
      } else {
        setSelectedCities([selectedCities[0], city]);
        // Automatically find path when second city is selected
        setTimeout(() => {
          handleFindPath([selectedCities[0], city]);
        }, 100);
      }
    }
    // If two cities are selected, clear previous and set new city as start
    else if (selectedCities.length === 2) {
      // If clicking the same city, clear it
      if (selectedCities[0].name === city.name || selectedCities[1].name === city.name) {
        setSelectedCities([]);
      } else {
        // Clear previous selections and set new city as start
        setSelectedCities([city]);
      }
    }

    // Clear any existing path when selecting new cities
    setPath([]);
    setVisitedOrder([]);
    setTotalDistance(0);
    setRoadDistance(0);
    setNodesExplored(0);
    setRoadRoute([]);
  };

  const handleFindPath = (citiesToUse: City[] = selectedCities, algorithmOverride?: AlgorithmType) => {
    if (citiesToUse.length !== 2) return;

    const algoToUse = algorithmOverride || algorithm;

    // Set loading state immediately for A* and Dijkstra since they fetch road routes
    if (algoToUse === 'astar' || algoToUse === 'dijkstra') {
      setIsLoadingRoute(true);
    }

    const graph = createGraph(cities);
    const heuristic = createHeuristic(cities, citiesToUse[1].name);

    let result;
    switch (algoToUse) {
      case 'astar':
        result = astar(graph, heuristic, citiesToUse[0].name, citiesToUse[1].name);
        break;
      case 'dijkstra':
        result = dijkstra(graph, citiesToUse[0].name, citiesToUse[1].name);
        break;
      case 'bfs':
        result = bfs(graph, citiesToUse[0].name, citiesToUse[1].name);
        break;
      case 'dfs':
        result = dfs(graph, citiesToUse[0].name, citiesToUse[1].name);
        break;
      case 'iddfs':
        result = iddfs(graph, citiesToUse[0].name, citiesToUse[1].name);
        break;
      default:
        result = astar(graph, heuristic, citiesToUse[0].name, citiesToUse[1].name);
    }

    setPath(result.path);
    setNodesExplored(result.nodesExplored);
    // Only update algorithm state if we used an override (meaning it changed)
    if (algorithmOverride) {
      setAlgorithm(algorithmOverride);
    }
    setVisitedOrder(result.visitedOrder || []);

    if (result.path.length > 0) {
      const startCity = cities.find(city => city.name === result.path[0]);
      const endCity = cities.find(city => city.name === result.path[result.path.length - 1]);
      if (startCity && endCity) {
        setSelectedCities([startCity, endCity]);
      }
    } else {
      setSelectedCities([]);
    }

    if (result.algorithm === 'astar' || result.algorithm === 'dijkstra') {
      setTotalDistance(0);
      fetchRoadRoute(result.path);
    } else {
      const graph = createGraph(cities);
      const straightLineDistance = calculatePathDistance(result.path, graph);
      setTotalDistance(straightLineDistance);
      setRoadDistance(0);
      setRoadRoute([]);
    }

    // We don't need to call handlePathFound here anymore since we did the updates above
    // But we should keep the signature for the child component if we want to keep it dumb
  };

  const handleAlgorithmChange = (newAlgorithm: AlgorithmType) => {
    setAlgorithm(newAlgorithm);

    if (selectedCities.length === 2) {
      // Recalculate immediately with new algorithm
      handleFindPath(selectedCities, newAlgorithm);
    } else {
      // Only clear if we don't have a valid path to recalculate
      setPath([]);
      setVisitedOrder([]);
      setTotalDistance(0);
      setRoadDistance(0);
      setNodesExplored(0);
      setRoadRoute([]);
    }
  }

  const fetchRoadRoute = async (path: string[]) => {
    if (path.length < 2) return

    try {
      const coordinates = path.map(cityName => {
        const city = cities.find(c => c.name === cityName)
        return city ? `${city.lng},${city.lat}` : null
      }).filter((coord): coord is string => coord !== null)

      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates.join(';')}?overview=full&geometries=geojson`

      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)
      const data = await response.json()

      if (data.routes && data.routes[0]) {
        const roadDist = data.routes[0].distance / 1000
        setRoadDistance(roadDist)
        setTotalDistance(roadDist)

        const routeCoordinates = data.routes[0].geometry.coordinates.map((coord: number[]) =>
          [coord[1], coord[0]] as [number, number]
        )
        setRoadRoute(routeCoordinates)
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Road route fetch timed out')
      } else {
        console.error('Error fetching road route:', error)
      }
      // Fall back to straight-line distance
      const graph = createGraph(cities)
      const straightLineDistance = calculatePathDistance(path, graph)
      setTotalDistance(straightLineDistance)
      setRoadDistance(0)
      setRoadRoute([])
    } finally {
      setIsLoadingRoute(false)
    }
  }

  const handleClearMarkings = () => {
    setSelectedCities([]);
    setPath([]);
    setVisitedOrder([]);
    setTotalDistance(0);
    setRoadDistance(0);
    setNodesExplored(0);
    setRoadRoute([]);
  };

  const handlePathFound = (
    path: string[],
    explored: number,
    algorithm: AlgorithmType,
    visitedOrder: string[] = []
  ) => {
    setPath(path)
    setNodesExplored(explored)
    setAlgorithm(algorithm)
    setVisitedOrder(visitedOrder)

    if (path.length > 0) {
      const startCity = cities.find(city => city.name === path[0])
      const endCity = cities.find(city => city.name === path[path.length - 1])
      if (startCity && endCity) {
        setSelectedCities([startCity, endCity])
      }
    } else {
      setSelectedCities([])
    }

    if (algorithm === 'astar' || algorithm === 'dijkstra') {
      setTotalDistance(0)
      fetchRoadRoute(path)
    } else {
      const graph = createGraph(cities)
      const straightLineDistance = calculatePathDistance(path, graph)
      setTotalDistance(straightLineDistance)
      setRoadDistance(0)
      setRoadRoute([])
    }
  }

  // Handle shared routes from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedRoute = parseSharedRoute(searchParams);

    if (sharedRoute) {
      const startCity = cities.find(city => city.name === sharedRoute.startCity);
      const endCity = cities.find(city => city.name === sharedRoute.endCity);

      if (startCity && endCity) {
        setSelectedCities([startCity, endCity]);
        setAlgorithm(sharedRoute.algorithm);
        setPath(sharedRoute.path);
        setTotalDistance(sharedRoute.totalDistance);
        setRoadDistance(sharedRoute.roadDistance);
        setNodesExplored(sharedRoute.nodesExplored);
        setVisitedOrder(sharedRoute.visitedOrder || []);

        if (sharedRoute.algorithm === 'astar' && sharedRoute.path.length > 0) {
          fetchRoadRoute(sharedRoute.path);
        }
      }
    }
  }, []);

  // Theme Switching Logic
  useEffect(() => {
    const body = document.body;
    // Remove all theme classes first
    body.classList.remove('dark', 'voyager');

    if (mapStyle === 'dark_all') {
      body.classList.add('dark');
    } else if (mapStyle === 'rastertiles/voyager') {
      body.classList.add('voyager');
    }
    // 'light_all' is default, no class needed
  }, [mapStyle]);

  // Save settings to cookie whenever they change
  useEffect(() => {
    Cookies.set('geoSettings', JSON.stringify({
      mapStyle,
      markerStyle,
      routeStyle
    }), { expires: 365 });
  }, [mapStyle, markerStyle, routeStyle]);

  return (
    <div className="relative w-full h-screen transition-colors duration-300 bg-bg-main text-text-body dark:bg-neutral-900 dark:text-white">
      <div className={`w-full h-full lg:h-full ${totalDistance > 0 ? 'pb-20' : ''} lg:pb-0`}>
        <Map
          selectedCities={selectedCities}
          path={path}
          algorithm={algorithm}
          roadRoute={roadRoute}
          visitedOrder={visitedOrder}
          mapStyle={mapStyle}
          markerStyle={markerStyle}
          routeStyle={routeStyle}
          setMapStyle={setMapStyle}
          setMarkerStyle={setMarkerStyle}
          setRouteStyle={setRouteStyle}
          onCitySelect={handleCitySelect}
          onClearMarkings={handleClearMarkings}
          cities={cities}
        />
      </div>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-[1001] lg:hidden glass p-3.5 rounded-xl shadow-lg hover:shadow-xl border border-border-light/50 transition-all duration-200 text-text-body dark:text-neutral-200 dark:border-neutral-700/50 transform hover:scale-110 active:scale-95"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001] lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <PathfindingControls
        onPathFound={handlePathFound}
        onAlgorithmChange={handleAlgorithmChange}
        cities={cities}
        algorithmType={algorithm}
        totalDistance={totalDistance}
        roadDistance={roadDistance}
        nodesExplored={nodesExplored}
        path={path}

        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        selectedCities={selectedCities}
        onCitySelect={handleCitySelect}
        isLoadingRoute={isLoadingRoute}
      />
    </div>
  )
}

export default App
