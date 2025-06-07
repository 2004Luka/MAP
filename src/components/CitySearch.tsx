import { useState, useEffect, useRef } from 'react';
import type { City } from '../types';

interface CitySearchProps {
  label: string;
  onCitySelect: (city: City) => void;
  onCityRemove: () => void;
  selectedCity: City | null;
  cities: City[];
}

export const CitySearch = ({
  label,
  onCitySelect,
  onCityRemove,
  selectedCity,
  cities
}: CitySearchProps) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCities([]);
      setShowDropdown(false);
    }
  }, [search, cities]);

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setSearch('');
    setShowDropdown(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {selectedCity ? (
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
          <span className="flex-1">{selectedCity.name}</span>
          <button
            onClick={onCityRemove}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showDropdown && filteredCities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                >
                  <div className="font-medium">{city.name}</div>
                  {city.region && (
                    <div className="text-sm text-gray-500">{city.region}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 