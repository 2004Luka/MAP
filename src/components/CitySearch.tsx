import { useState, useEffect, useRef } from 'react';
import type { City } from '../types';

interface CitySearchProps {
  label: string;
  onCitySelect: (city: City) => void;
  onCityRemove: () => void;
  selectedCity: City | null;
  cities: City[];
  isDark: boolean;
}

export const CitySearch = ({
  label,
  onCitySelect,
  onCityRemove,
  selectedCity,
  cities,
  isDark
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
    <div className="animate-slide-up">
      <label className="block text-sm font-semibold text-secondary-700 mb-2 dark:text-gray-300">
        {label}
      </label>
      {selectedCity ? (
        <div className="flex items-center gap-3 bg-white border border-primary-200 px-4 py-3 rounded-lg animate-scale-in text-secondary-900 dark:bg-gray-800 dark:text-white dark:border-primary-500">
          <div className="flex-1">
            <div className="font-medium text-primary-900 dark:text-primary-100">{selectedCity.name}</div>
            {selectedCity.region && (
              <div className="text-sm text-primary-600 dark:text-primary-300">{selectedCity.region}</div>
            )}
          </div>
          <button
            onClick={onCityRemove}
            className="text-primary-500 hover:text-primary-700 p-1 rounded-full hover:bg-primary-100 transition-all duration-200 dark:text-primary-300 dark:hover:text-primary-100 dark:hover:bg-primary-800"
            aria-label="Remove selected city"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}...`}
            className="input-field bg-white border border-secondary-200 text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && filteredCities.length > 0 && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-secondary-200 rounded-lg shadow-strong max-h-60 overflow-auto animate-slide-down text-secondary-900 dark:bg-gray-800 dark:text-white dark:border-gray-600">
              {filteredCities.map((city, index) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-secondary-50 focus:outline-none focus:bg-secondary-50 transition-colors duration-150 border-b border-secondary-100 last:border-b-0 text-secondary-900 dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:border-gray-600 dark:text-white"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="font-medium text-secondary-900 dark:text-white">{city.name}</div>
                  {city.region && (
                    <div className="text-sm text-secondary-600 mt-0.5 dark:text-gray-300">{city.region}</div>
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