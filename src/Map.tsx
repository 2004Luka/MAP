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
        className="rounded-xl overflow-hidden shadow-xl"
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
              fillColor: isSelected ? (isStartCity ? '#D9AF6B' : '#68855C') : markerStyle.color, // accent for start, success for end
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
                        fillColor: '#526A83' // primary-500
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

        {/* Animation progress indicator */}
        {isAnimating && (
          <div className="absolute top-4 right-4 glass rounded-xl shadow-xl p-4 z-[1100] w-64 max-w-[90vw] border border-border-light/50 dark:border-neutral-700/50 animate-fade-in">
            <div className="text-sm font-semibold text-text-body dark:text-neutral-300 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Drawing Route...
            </div>
            <div className="w-full bg-bg-subtle/60 dark:bg-neutral-700/60 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-600 to-primary-700 h-2.5 rounded-full transition-all duration-100 shadow-sm"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
            <div className="text-xs font-medium text-text-muted dark:text-neutral-400 mt-2 text-right">
              {Math.round(animationProgress * 100)}%
            </div>
          </div>
        )}
      </MapContainer>

      {/* Top Instruction Popup */}
      {selectedCities.length === 0 && showInstruction && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1200] pointer-events-none animate-fade-in">
          <div className="glass rounded-xl px-5 py-4 shadow-xl border border-border-light/50 dark:border-neutral-700/50 max-w-sm pointer-events-auto relative">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
                </svg>
              </div>
              <span className="text-sm font-medium text-text-body dark:text-neutral-300 flex-1">Click on city dots to select start and end points</span>
              <button
                onClick={() => setShowInstruction(false)}
                className="text-text-muted hover:text-text-body dark:hover:text-neutral-300 transition-colors p-1 rounded-lg hover:bg-bg-hover dark:hover:bg-neutral-700"
                aria-label="Close instruction"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
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
        markerStyle={markerStyle}
        routeStyle={routeStyle}
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