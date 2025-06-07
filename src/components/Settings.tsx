import { useState } from 'react';
import { IoMdSettings } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

interface SettingsProps {
  onMapStyleChange: (style: string) => void;
  onMarkerStyleChange: (style: { size: number; color: string }) => void;
  onRouteStyleChange: (style: { weight: number; color: string; opacity: number }) => void;
}

const Settings = ({ onMapStyleChange, onMarkerStyleChange, onRouteStyleChange }: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMarkerStyle, setCurrentMarkerStyle] = useState({ size: 4, color: '#6B7280' });
  const [currentRouteStyle, setCurrentRouteStyle] = useState({ weight: 3, color: '#3B82F6', opacity: 0.8 });

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
        className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
      >
        <IoMdSettings className="w-6 h-6 text-gray-600" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1001] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Map Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            {/* Map Style */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Map Style</h3>
              <div className="grid grid-cols-3 gap-2">
                {mapStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => onMapStyleChange(style.value)}
                    className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Marker Style */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Marker Style</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Size</label>
                  <div className="flex gap-2">
                    {markerSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleMarkerSizeChange(size)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Color</label>
                  <div className="flex gap-2">
                    {markerColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleMarkerColorChange(color)}
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Route Style */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Route Style</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Weight</label>
                  <div className="flex gap-2">
                    {routeWeights.map((weight) => (
                      <button
                        key={weight}
                        onClick={() => handleRouteWeightChange(weight)}
                        className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                      >
                        {weight}px
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Color</label>
                  <div className="flex gap-2">
                    {routeColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleRouteColorChange(color)}
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Opacity</label>
                  <div className="flex gap-2">
                    {routeOpacities.map((opacity) => (
                      <button
                        key={opacity}
                        onClick={() => handleRouteOpacityChange(opacity)}
                        className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
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