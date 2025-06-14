import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import './App.css'
import Map from './Map'
import { PathfindingControls } from './components/PathfindingControls'
import { cities } from './data/cities'
import type { City, AlgorithmType } from './types'
import { calculatePathDistance, createGraph } from './utils/pathfinding'

function App() {
  // Load from cookies if present
  const cookieStart = Cookies.get('startCity')
  const cookieEnd = Cookies.get('endCity')
  const cookieSettings = Cookies.get('geoSettings')
  const [selectedCities, setSelectedCities] = useState<City[]>([
    cookieStart ? cities.find(c => c.name === cookieStart)! : undefined,
    cookieEnd ? cities.find(c => c.name === cookieEnd)! : undefined,
  ].filter(Boolean) as City[])
  const [path, setPath] = useState<string[]>([])
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('astar')
  const [totalDistance, setTotalDistance] = useState<number>(0)
  const [roadDistance, setRoadDistance] = useState<number>(0)
  const [nodesExplored, setNodesExplored] = useState<number>(0)
  const [roadRoute, setRoadRoute] = useState<[number, number][]>([])
  // Settings state
  const [mapStyle, setMapStyle] = useState(cookieSettings ? JSON.parse(cookieSettings).mapStyle : 'light_all')
  const [markerStyle, setMarkerStyle] = useState(cookieSettings ? JSON.parse(cookieSettings).markerStyle : { size: 4, color: '#6B7280' })
  const [routeStyle, setRouteStyle] = useState(cookieSettings ? JSON.parse(cookieSettings).routeStyle : { weight: 3, color: '#3B82F6', opacity: 0.8 })

  // Save to cookies on change
  useEffect(() => {
    if (selectedCities[0]) Cookies.set('startCity', selectedCities[0].name)
    if (selectedCities[1]) Cookies.set('endCity', selectedCities[1].name)
  }, [selectedCities])
  useEffect(() => {
    Cookies.set('geoSettings', JSON.stringify({ mapStyle, markerStyle, routeStyle }))
  }, [mapStyle, markerStyle, routeStyle])

  const handlePathFound = (
    path: string[],
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
        mapStyle={mapStyle}
        markerStyle={markerStyle}
        routeStyle={routeStyle}
        setMapStyle={setMapStyle}
        setMarkerStyle={setMarkerStyle}
        setRouteStyle={setRouteStyle}
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
