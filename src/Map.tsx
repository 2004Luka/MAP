import { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Polyline } from 'react-leaflet';
import type { City } from './types';
import type { AlgorithmType } from './types';
import { createStartIcon, createEndIcon, createWaypointIcon, getBoundsFromCities } from './utils/map';
import { createRouteAnimation, interpolatePath, getAnimatedPathStyle } from './utils/routeAnimation';
import Settings from './components/Settings';
import { MapControls } from './components/MapControls';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  selectedCities: City[];
  path: string[];
  algorithm: AlgorithmType;
  roadRoute: [number, number][];
  mapStyle: string;
  markerStyle: { size: number; color: string };
  routeStyle: { weight: number; color: string; opacity: number };
  setMapStyle: (style: string) => void;
  setMarkerStyle: (style: { size: number; color: string }) => void;
  setRouteStyle: (style: { weight: number; color: string; opacity: number }) => void;
  onCitySelect?: (city: City) => void;
  onClearMarkings?: () => void;
  cities: City[];
}

const Map = ({ selectedCities, path, algorithm, roadRoute, mapStyle, markerStyle, routeStyle, setMapStyle, setMarkerStyle, setRouteStyle, onCitySelect, onClearMarkings, cities }: MapProps) => {
  const mapRef = useRef<L.Map>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [animatedPath, setAnimatedPath] = useState<[number, number][]>([]);
  const [showInstruction, setShowInstruction] = useState(true);

  // Removed automatic zoom on city selection

  useEffect(() => {
    if (path.length > 0 && (algorithm === 'astar' ? roadRoute.length > 0 : true)) {
      setIsAnimating(true);
      setAnimationProgress(0);
      
      const pathToAnimate = algorithm === 'astar' ? roadRoute : getPathCoordinates(path);
      
      const cancelAnimation = createRouteAnimation(
        3000,
        (progress) => {
          setAnimationProgress(progress);
          const interpolatedPath = interpolatePath(pathToAnimate, progress);
          setAnimatedPath(interpolatedPath);
        },
        () => {
          setIsAnimating(false);
          setAnimatedPath(pathToAnimate);
        }
      );

      return cancelAnimation;
    }
  }, [path, algorithm, roadRoute]);

  const getPathCoordinates = (path: string[]) => {
    return path.map(cityName => {
      const city = cities.find(c => c.name === cityName);
      return city ? [city.lat, city.lng] as [number, number] : null;
    }).filter((coord): coord is [number, number] => coord !== null);
  };

  const getTileLayerUrl = (style: string) => {
    switch (style) {
      case 'light_all':
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      case 'dark_all':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'rastertiles/voyager':
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      default:
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    }
  };

  const getPathToRender = () => {
    if (isAnimating) {
      return animatedPath;
    }
    return algorithm === 'astar' ? roadRoute : getPathCoordinates(path);
  };

  const pathToRender = getPathToRender();
  const animatedStyle = getAnimatedPathStyle(isAnimating, routeStyle);

  // Zoom functions
  const handleZoomToSelected = () => {
    if (mapRef.current && selectedCities.length > 0) {
      const bounds = getBoundsFromCities(selectedCities);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleZoomToAll = () => {
    if (mapRef.current && cities.length > 0) {
      const bounds = getBoundsFromCities(cities);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const handleClearMarkings = () => {
    if (onClearMarkings) {
      onClearMarkings();
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[42.3154, 43.3569]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        attributionControl={false}
        className="rounded-lg overflow-hidden shadow-strong"
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        easeLinearity={0.35}
      >
        <TileLayer
          url={getTileLayerUrl(mapStyle)}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
          minZoom={3}
        />
        
        {/* Enhanced city markers with click functionality */}
        {cities.map((city) => {
          const isSelected = selectedCities.some(selectedCity => selectedCity.name === city.name);
          const isStartCity = selectedCities[0]?.name === city.name;
          
          return (
            <CircleMarker
              key={city.name}
              center={[city.lat, city.lng]}
              radius={markerStyle.size}
                          pathOptions={{
              fillColor: isSelected ? (isStartCity ? '#EF4444' : '#10B981') : markerStyle.color,
              color: '#ffffff',
              weight: isSelected ? 3 : 2,
              opacity: 1,
              fillOpacity: isSelected ? 1 : 0.8,
            }}
                        className="cursor-pointer"
            eventHandlers={{
                                  mouseover: (e) => {
                    const layer = e.target;
                    if (!isSelected) {
                      layer.setStyle({
                        fillOpacity: 1,
                        weight: 3,
                        radius: markerStyle.size + 3,
                        fillColor: '#3B82F6'
                      });
                    }
                  },
                mouseout: (e) => {
                  const layer = e.target;
                  if (!isSelected) {
                    layer.setStyle({
                      fillOpacity: 0.8,
                      weight: 2,
                      radius: markerStyle.size,
                      fillColor: markerStyle.color
                    });
                  }
                },
                click: () => {
                  if (onCitySelect) {
                    onCitySelect(city);
                  }
                }
              }}
            />
          );
        })}

        {/* Custom markers for selected cities */}
        {selectedCities.map((city, index) => (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={index === 0 ? createStartIcon() : createEndIcon()}
            eventHandlers={{
              mouseover: (e) => {
                const marker = e.target;
                marker.getElement()?.style.setProperty('transform', 'scale(1.2)');
              },
              mouseout: (e) => {
                const marker = e.target;
                marker.getElement()?.style.setProperty('transform', 'scale(1)');
              }
            }}
          />
        ))}

        {/* Waypoint markers for intermediate cities */}
        {path.length > 2 && path.slice(1, -1).map((cityName, index) => {
          const city = cities.find(c => c.name === cityName);
          if (!city) return null;
          
          return (
            <Marker
              key={`waypoint-${cityName}`}
              position={[city.lat, city.lng]}
              icon={createWaypointIcon(index)}
              eventHandlers={{
                mouseover: (e) => {
                  const marker = e.target;
                  marker.getElement()?.style.setProperty('transform', 'scale(1.2)');
                },
                mouseout: (e) => {
                  const marker = e.target;
                  marker.getElement()?.style.setProperty('transform', 'scale(1)');
                }
              }}
            />
          );
        })}

        {/* Enhanced route visualization with animation */}
        {pathToRender.length > 0 && (
          <>
            {algorithm === 'iddfs' && (
              <Polyline
                positions={pathToRender}
                pathOptions={{
                  color: animatedStyle.color,
                  weight: animatedStyle.weight,
                  opacity: animatedStyle.opacity,
                  dashArray: animatedStyle.dashArray || '8, 12',
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            )}
            
            {algorithm === 'astar' && (
              <Polyline
                positions={pathToRender}
                pathOptions={{
                  color: animatedStyle.color,
                  weight: animatedStyle.weight,
                  opacity: animatedStyle.opacity,
                  dashArray: animatedStyle.dashArray,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            )}
          </>
        )}

        {/* Floating Controls Container (top-left, vertical stack) */}
        <div className="absolute top-4 left-4 z-[1100] flex flex-col gap-3 items-start">
          {/* Add more floating controls here if needed */}
        </div>

        {/* Animation progress indicator (top-right, never overlaps 3D button) */}
        {isAnimating && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1100] w-56 max-w-[90vw]">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Drawing Route...
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(animationProgress * 100)}%
            </div>
          </div>
        )}
      </MapContainer>

      {/* Top Instruction Popup */}
      {selectedCities.length === 0 && showInstruction && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1200] pointer-events-none">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-600 max-w-sm pointer-events-auto relative">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-200">Click on city dots to select start and end points</span>
              <button
                onClick={() => setShowInstruction(false)}
                className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close instruction"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <Settings
        onMapStyleChange={setMapStyle}
        onMarkerStyleChange={setMarkerStyle}
        onRouteStyleChange={setRouteStyle}
        mapStyle={mapStyle}
      />

      <MapControls
        selectedCities={selectedCities}
        onClearMarkings={handleClearMarkings}
        onZoomToSelected={handleZoomToSelected}
        onZoomToAll={handleZoomToAll}
        cities={cities}
      />


    </div>
  );
};

export default Map; 