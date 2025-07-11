import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import './App.css'
import Map from './Map'
import { PathfindingControls } from './components/PathfindingControls'
import { cities } from './data/cities'
import type { City, AlgorithmType } from './types'
import { calculatePathDistance, createGraph } from './utils/pathfinding'

function App() {
  const cookieSettings = Cookies.get('geoSettings')
  const parsedSettings = cookieSettings ? JSON.parse(cookieSettings) : {}
  
  const [selectedCities, setSelectedCities] = useState<City[]>([])
  const [path, setPath] = useState<string[]>([])
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('astar')
  const [totalDistance, setTotalDistance] = useState<number>(0)
  const [roadDistance, setRoadDistance] = useState<number>(0)
  const [nodesExplored, setNodesExplored] = useState<number>(0)
  const [roadRoute, setRoadRoute] = useState<[number, number][]>([])
  const [mapStyle, setMapStyle] = useState(parsedSettings.mapStyle || 'light_all')
  const [markerStyle, setMarkerStyle] = useState(parsedSettings.markerStyle || { size: 4, color: '#6B7280' })
  const [routeStyle, setRouteStyle] = useState(parsedSettings.routeStyle || { weight: 3, color: '#3B82F6', opacity: 0.8 })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isDark = mapStyle === 'dark_all';

  useEffect(() => {
    if (mapStyle === 'dark_all') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mapStyle]);

  useEffect(() => {
    if (selectedCities[0]) Cookies.set('startCity', selectedCities[0].name)
    if (selectedCities[1]) Cookies.set('endCity', selectedCities[1].name)
  }, [selectedCities])
  
  useEffect(() => {
    Cookies.set('geoSettings', JSON.stringify({ 
      mapStyle, 
      markerStyle, 
      routeStyle
    }))
  }, [mapStyle, markerStyle, routeStyle])

  const handlePathFound = (
    path: string[],
    explored: number,
    algorithm: AlgorithmType
  ) => {
    setPath(path)
    setNodesExplored(explored)
    setAlgorithm(algorithm)

    if (path.length > 0) {
      const startCity = cities.find(city => city.name === path[0])
      const endCity = cities.find(city => city.name === path[path.length - 1])
      if (startCity && endCity) {
        setSelectedCities([startCity, endCity])
      }
    } else {
      setSelectedCities([])
    }

    if (algorithm === 'astar') {
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

  const handleAlgorithmChange = (newAlgorithm: AlgorithmType) => {
    setAlgorithm(newAlgorithm)
    setPath([])
    setTotalDistance(0)
    setRoadDistance(0)
    setNodesExplored(0)
    setRoadRoute([])
  }

  const fetchRoadRoute = async (path: string[]) => {
    if (path.length < 2) return

    try {
      const coordinates = path.map(cityName => {
        const city = cities.find(c => c.name === cityName)
        return city ? `${city.lng},${city.lat}` : null
      }).filter((coord): coord is string => coord !== null)

      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates.join(';')}?overview=full&geometries=geojson`
      const response = await fetch(url)
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
      console.error('Error fetching road route:', error)
      setRoadDistance(0)
      setTotalDistance(0)
      setRoadRoute([])
    }
  }

  return (
    <div className={`relative w-full h-screen transition-colors duration-300 bg-secondary-50 text-secondary-900 dark:bg-gray-900 dark:text-white`}>
      <div className={`w-full h-full lg:h-full ${totalDistance > 0 ? 'pb-20' : ''} lg:pb-0`}>
        <Map
          selectedCities={selectedCities}
          path={path}
          algorithm={algorithm}
          roadRoute={roadRoute}
          mapStyle={mapStyle}
          markerStyle={markerStyle}
          routeStyle={routeStyle}
          setMapStyle={setMapStyle}
          setMarkerStyle={setMarkerStyle}
          setRouteStyle={setRouteStyle}
          isDark={isDark}
        />
      </div>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 left-4 z-[1001] lg:hidden rounded-lg p-3 shadow-lg border transition-all duration-200 bg-white border-secondary-200 hover:shadow-xl text-secondary-700 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200`}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1001] lg:hidden"
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
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        isDark={isDark}
      />
    </div>
  )
}

export default App
