import { useState, useEffect, useRef } from 'react';
import { IoMdSettings } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

interface SettingsProps {
  onMapStyleChange: (style: string) => void;
  onMarkerStyleChange: (style: { size: number; color: string }) => void;
  onRouteStyleChange: (style: { weight: number; color: string; opacity: number }) => void;
  mapStyle: string;
}

const Settings = ({ onMapStyleChange, onMarkerStyleChange, onRouteStyleChange, mapStyle }: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMarkerStyle, setCurrentMarkerStyle] = useState({ size: 4, color: '#6B7280' });
  const [currentRouteStyle, setCurrentRouteStyle] = useState({ weight: 3, color: '#3B82F6', opacity: 0.8 });
  const modalRef = useRef<HTMLDivElement>(null);

  const mapStyles = [
    { name: 'Light', value: 'light_all' },
    { name: 'Dark', value: 'dark_all' },
    { name: 'Satellite', value: 'rastertiles/voyager' },
  ];

  const markerSizes = [3, 4, 5, 6];
  const markerColors = ['#6B7280', '#3B82F6', '#10B981', '#F59E0B'];

  const routeWeights = [2, 3, 4, 5];
  const routeColors = ['#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];
  const routeOpacities = [0.6, 0.7, 0.8, 0.9];

  // Handle click outside to close modal
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
        className="absolute top-5 right-5 z-[1000] glass p-3 rounded-lg hover:bg-white/90 transition-all duration-200 transform hover:scale-110 active:scale-95 bg-white text-secondary-900 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/90"
        aria-label="Open settings"
      >
        <IoMdSettings className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1004] flex items-center justify-center animate-fade-in">
          <div 
            ref={modalRef}
            className="card p-8 w-[500px] max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto animate-scale-in hide-scrollbar bg-white text-secondary-900 border border-secondary-100 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-1 dark:text-white">Map Settings</h2>
                <p className="text-sm text-secondary-600 dark:text-gray-300">Customize your map appearance</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-secondary-400 hover:text-secondary-600 p-2 rounded-full hover:bg-secondary-100 transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Close settings"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            {/* Map Style */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2 dark:text-white">
                <span className="text-xl">🗺️</span>
                Map Style
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {mapStyles.map((style) => {
                  const isActive = style.value === mapStyle;
                  return (
                    <button
                      key={style.value}
                      onClick={() => onMapStyleChange(style.value)}
                      className={
                        "flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 transform " +
                        (isActive
                          ? "border-primary-500 bg-primary-100 dark:border-primary-400 dark:bg-primary-900"
: "border-secondary-200 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-600 dark:hover:border-primary-400 dark:hover:bg-primary-900")
                      }
                    >
                      <span className="text-sm font-medium text-secondary-700 dark:text-gray-300">{style.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Marker Style */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2 dark:text-white">
                <span className="text-xl">📍</span>
                Marker Style
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-3 block dark:text-gray-300">Size</label>
                  <div className="flex gap-3">
                    {markerSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleMarkerSizeChange(size)}
                        className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-sm font-semibold text-secondary-700 hover:bg-primary-100 hover:text-primary-700 transition-all duration-200 transform hover:scale-110 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-primary-800 dark:hover:text-primary-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-3 block dark:text-gray-300">Color</label>
                  <div className="flex gap-3">
                    {markerColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleMarkerColorChange(color)}
                        className="w-12 h-12 rounded-full border-2 border-secondary-200 hover:border-primary-300 transition-all duration-200 transform hover:scale-110 dark:border-gray-600 hover:dark:border-primary-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Route Style */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2 dark:text-white">
                <span className="text-xl"></span>
                Route Style
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-3 block dark:text-gray-300">Weight</label>
                  <div className="flex gap-3">
                    {routeWeights.map((weight) => (
                      <button
                        key={weight}
                        onClick={() => handleRouteWeightChange(weight)}
                        className="px-4 py-2 text-sm font-medium border-2 border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 transform hover:scale-105 dark:border-gray-600 dark:hover:border-primary-400 dark:hover:bg-primary-900"
                      >
                        {weight}px
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-3 block dark:text-gray-300">Color</label>
                  <div className="flex gap-3">
                    {routeColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleRouteColorChange(color)}
                        className="w-12 h-12 rounded-full border-2 border-secondary-200 hover:border-primary-300 transition-all duration-200 transform hover:scale-110 dark:border-gray-600 hover:dark:border-primary-400"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-3 block dark:text-gray-300">Opacity</label>
                  <div className="flex gap-3">
                    {routeOpacities.map((opacity) => (
                      <button
                        key={opacity}
                        onClick={() => handleRouteOpacityChange(opacity)}
                        className="px-4 py-2 text-sm font-medium border-2 border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 transform hover:scale-105 dark:border-gray-600 dark:hover:border-primary-400 dark:hover:bg-primary-900"
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