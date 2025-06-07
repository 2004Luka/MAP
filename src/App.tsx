import { useState } from 'react'
import './App.css'
import Map from './Map'
import { PathfindingControls } from './components/PathfindingControls'
import { cities } from './data/cities'
import type { City, AlgorithmType } from './types'
import { calculatePathDistance, createGraph } from './utils/pathfinding'

function App() {
  const [selectedCities, setSelectedCities] = useState<City[]>([])
  const [path, setPath] = useState<string[]>([])
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('astar')
  const [totalDistance, setTotalDistance] = useState<number>(0)
  const [roadDistance, setRoadDistance] = useState<number>(0)
  const [nodesExplored, setNodesExplored] = useState<number>(0)
  const [roadRoute, setRoadRoute] = useState<[number, number][]>([])

  const handlePathFound = (
    path: string[],
    distance: number,
    explored: number,
    algorithm: AlgorithmType
  ) => {
    setPath(path)
    setNodesExplored(explored)
    setAlgorithm(algorithm)

    // Update selected cities based on the path
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
      // For A*, only use road distance
      setTotalDistance(0) // Will be updated when road route is fetched
      // Fetch road route for A* algorithm
      fetchRoadRoute(path)
    } else {
      // For IDDFS, use straight-line distance
      const graph = createGraph(cities)
      const straightLineDistance = calculatePathDistance(path, graph)
      setTotalDistance(straightLineDistance)
      setRoadDistance(0)
      setRoadRoute([])
    }
  }

  const handleAlgorithmChange = (newAlgorithm: AlgorithmType) => {
    setAlgorithm(newAlgorithm)
    // Clear previous results when changing algorithm
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
        // Calculate road distance from the route
        const roadDist = data.routes[0].distance / 1000 // Convert meters to kilometers
        setRoadDistance(roadDist)
        setTotalDistance(roadDist) // Use road distance as total distance for A*
        
        // Extract road route coordinates
        const routeCoordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => 
          [coord[1], coord[0]] as [number, number] // Convert [lng, lat] to [lat, lng]
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
    <div className="relative w-full h-screen">
      <Map
        selectedCities={selectedCities}
        path={path}
        algorithm={algorithm}
        roadRoute={roadRoute}
      />
      <PathfindingControls
        onPathFound={handlePathFound}
        onAlgorithmChange={handleAlgorithmChange}
        cities={cities}
        algorithmType={algorithm}
        totalDistance={totalDistance}
        roadDistance={roadDistance}
        nodesExplored={nodesExplored}
      />
    </div>
  )
}

export default App
