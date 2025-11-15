import { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
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
    <div className="animate-slide-up">
      <label className="block text-sm font-semibold text-text-header mb-2.5 dark:text-neutral-300">
        {label}
      </label>
      {selectedCity ? (
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary-50 to-primary-100/50 border-2 border-primary-200 px-4 py-3.5 rounded-xl animate-scale-in text-text-body dark:from-primary-900/30 dark:to-primary-900/20 dark:text-neutral-50 dark:border-primary-500/50">
          <div className="flex-1">
            <div className="font-semibold text-primary-700 dark:text-primary-300">{selectedCity.name}</div>
            {selectedCity.region && (
              <div className="text-sm text-primary-600 dark:text-primary-400 mt-0.5">{selectedCity.region}</div>
            )}
          </div>
          <button
            onClick={onCityRemove}
            className="text-primary-600 hover:text-primary-700 p-1.5 rounded-lg hover:bg-primary-200/50 transition-all duration-200 dark:text-primary-300 dark:hover:text-primary-100 dark:hover:bg-primary-800/50"
            aria-label="Remove selected city"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="input-field pl-10"
              onFocus={() => setShowDropdown(true)}
            />
          </div>
          {showDropdown && filteredCities.length > 0 && (
            <div className="absolute z-20 w-full mt-2 bg-bg-card border-2 border-border-light rounded-xl shadow-xl max-h-60 overflow-auto animate-slide-down text-text-body dark:bg-neutral-800 dark:text-neutral-50 dark:border-neutral-600">
              {filteredCities.map((city, index) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3.5 text-left hover:bg-primary-50 focus:outline-none focus:bg-primary-50 transition-colors duration-150 border-b border-border-light last:border-b-0 text-text-body dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-50"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="font-semibold text-text-header dark:text-neutral-50">{city.name}</div>
                  {city.region && (
                    <div className="text-sm text-text-muted mt-0.5 dark:text-neutral-400">{city.region}</div>
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
