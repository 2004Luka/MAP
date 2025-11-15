import { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, X, Map, MapPin, Route } from 'lucide-react';

interface SettingsProps {
  onMapStyleChange: (style: string) => void;
  onMarkerStyleChange: (style: { size: number; color: string }) => void;
  onRouteStyleChange: (style: { weight: number; color: string; opacity: number }) => void;
  mapStyle: string;
  markerStyle: { size: number; color: string };
  routeStyle: { weight: number; color: string; opacity: number };
}

const Settings = ({ onMapStyleChange, onMarkerStyleChange, onRouteStyleChange, mapStyle, markerStyle, routeStyle }: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMarkerStyle, setCurrentMarkerStyle] = useState(markerStyle);
  const [currentRouteStyle, setCurrentRouteStyle] = useState(routeStyle);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentMarkerStyle(markerStyle);
  }, [markerStyle]);

  useEffect(() => {
    setCurrentRouteStyle(routeStyle);
  }, [routeStyle]);

  const mapStyles = [
    { name: 'Light', value: 'light_all', icon: '☀️' },
    { name: 'Dark', value: 'dark_all', icon: '🌙' },
    { name: 'Voyager', value: 'rastertiles/voyager', icon: '🗺️' },
  ];

  const markerSizes = [3, 4, 5, 6];
  const markerColors = ['#737373', '#0D9488', '#059669', '#F59E0B']; // neutral, primary, success, accent

  const routeWeights = [2, 3, 4, 5];
  const routeColors = ['#0D9488', '#059669', '#DC2626', '#2563EB']; // primary, success, error, info
  const routeOpacities = [0.6, 0.7, 0.8, 0.9];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkerSizeChange = (size: number) => {
    const newStyle = { ...currentMarkerStyle, size };
    setCurrentMarkerStyle(newStyle);
    onMarkerStyleChange(newStyle);
  };

  const handleMarkerColorChange = (color: string) => {
    const newStyle = { ...currentMarkerStyle, color };
    setCurrentMarkerStyle(newStyle);
    onMarkerStyleChange(newStyle);
  };

  const handleRouteWeightChange = (weight: number) => {
    const newStyle = { ...currentRouteStyle, weight };
    setCurrentRouteStyle(newStyle);
    onRouteStyleChange(newStyle);
  };

  const handleRouteColorChange = (color: string) => {
    const newStyle = { ...currentRouteStyle, color };
    setCurrentRouteStyle(newStyle);
    onRouteStyleChange(newStyle);
  };

  const handleRouteOpacityChange = (opacity: number) => {
    const newStyle = { ...currentRouteStyle, opacity };
    setCurrentRouteStyle(newStyle);
    onRouteStyleChange(newStyle);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-20 z-[1000] glass p-3.5 rounded-xl hover:bg-white/95 transition-all duration-200 transform hover:scale-110 active:scale-95 text-neutral-700 dark:text-neutral-200 shadow-lg hover:shadow-xl"
        aria-label="Open settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1004] flex items-center justify-center p-4 animate-fade-in">
          <div 
            ref={modalRef}
            className="card p-8 w-[540px] max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto animate-scale-in hide-scrollbar"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-text-header mb-1 dark:text-neutral-50">Map Settings</h2>
                <p className="text-sm text-text-muted dark:text-neutral-400 font-medium">Customize your map appearance</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-body p-2 rounded-full hover:bg-bg-hover transition-all duration-200 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-700"
                aria-label="Close settings"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Map Style */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-header mb-4 flex items-center gap-2 dark:text-neutral-50">
                <Map className="w-5 h-5 text-primary" />
                Map Style
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {mapStyles.map((style) => {
                  const isActive = style.value === mapStyle;
                  return (
                    <button
                      key={style.value}
                      onClick={() => onMapStyleChange(style.value)}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isActive
                          ? 'border-primary bg-primary-50 dark:border-primary-400 dark:bg-primary-900/30 shadow-md'
                          : 'border-border-light hover:border-primary-300 hover:bg-primary-50/50 dark:border-neutral-600 dark:hover:border-primary-400 dark:hover:bg-primary-900/20'
                      }`}
                    >
                      <span className="text-sm font-medium text-text-body dark:text-neutral-300">{style.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Marker Style */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-header mb-4 flex items-center gap-2 dark:text-neutral-50">
                <MapPin className="w-5 h-5 text-primary" />
                Marker Style
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-text-header mb-3 block dark:text-neutral-400">Size</label>
                  <div className="flex gap-3">
                    {markerSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleMarkerSizeChange(size)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 focus:ring-2 focus:ring-primary focus:outline-none min-w-[44px] min-h-[44px] ${
                          currentMarkerStyle.size === size
                            ? 'bg-primary-100 text-primary-700 ring-2 ring-primary shadow-md dark:bg-primary-900/30 dark:text-primary-300'
                            : 'bg-bg-subtle text-text-body hover:bg-primary-50 hover:text-primary-700 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-header mb-3 block dark:text-neutral-400">Color</label>
                  <div className="flex gap-3">
                    {markerColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleMarkerColorChange(color)}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-200 focus:ring-2 focus:ring-primary focus:outline-none min-w-[44px] min-h-[44px] ${
                          currentMarkerStyle.color === color
                            ? 'border-primary ring-2 ring-primary shadow-md dark:border-primary-400'
                            : 'border-border-light hover:border-primary-300 dark:border-neutral-600 hover:dark:border-primary-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Route Style */}
            <div>
              <h3 className="text-lg font-semibold text-text-header mb-4 flex items-center gap-2 dark:text-neutral-50">
                <Route className="w-5 h-5 text-primary" />
                Route Style
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-text-header mb-3 block dark:text-neutral-400">Weight</label>
                  <div className="flex gap-3">
                    {routeWeights.map((weight) => (
                      <button
                        key={weight}
                        onClick={() => handleRouteWeightChange(weight)}
                        className={`px-4 py-2 text-sm font-medium border-2 rounded-xl transition-all duration-200 min-h-[44px] ${
                          currentRouteStyle.weight === weight
                            ? 'border-primary bg-primary-50 text-primary-700 ring-2 ring-primary shadow-md dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'border-border-light hover:border-primary-300 hover:bg-primary-50/50 dark:border-neutral-600 dark:hover:border-primary-400 dark:hover:bg-primary-900/20'
                        }`}
                      >
                        {weight}px
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-header mb-3 block dark:text-neutral-400">Color</label>
                  <div className="flex gap-3">
                    {routeColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleRouteColorChange(color)}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-200 min-w-[44px] min-h-[44px] ${
                          currentRouteStyle.color === color
                            ? 'border-primary ring-2 ring-primary shadow-md dark:border-primary-400'
                            : 'border-border-light hover:border-primary-300 dark:border-neutral-600 hover:dark:border-primary-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-header mb-3 block dark:text-neutral-400">Opacity</label>
                  <div className="flex gap-3">
                    {routeOpacities.map((opacity) => (
                      <button
                        key={opacity}
                        onClick={() => handleRouteOpacityChange(opacity)}
                        className={`px-4 py-2 text-sm font-medium border-2 rounded-xl transition-all duration-200 min-h-[44px] ${
                          currentRouteStyle.opacity === opacity
                            ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500 shadow-md dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 dark:border-neutral-600 dark:hover:border-primary-400 dark:hover:bg-primary-900/20'
                        }`}
                      >
                        {opacity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
