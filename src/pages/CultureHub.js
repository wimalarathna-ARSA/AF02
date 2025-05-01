import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSearch, FiX, FiGlobe, FiInfo } from 'react-icons/fi';

const CultureHub = () => {
  const { isDarkMode } = useTheme();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const sortedData = data
          .filter(country => country.flags?.png)
          .sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sortedData);
        setFilteredCountries(sortedData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    let results = [...countries];
    if (searchTerm) {
      results = results.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (regionFilter !== 'all') {
      results = results.filter(country => 
        country.region?.toLowerCase() === regionFilter.toLowerCase()
      );
    }
    
    setFilteredCountries(results);
  }, [searchTerm, regionFilter, countries]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRegionFilter('all');
  };
  const regions = [...new Set(countries.map(country => country.region))].filter(Boolean).sort();

  if (loading) {
    return (
      <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold flex items-center">
              <FiGlobe className="mr-3 text-emerald-500" /> Explore Countries
            </h1>
            <div className="flex-1 max-w-md">
              <div className={`flex items-center px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm animate-pulse`}>
                <div className="h-6 w-full rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-10 w-24 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} animate-pulse`}></div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`h-64 rounded-xl shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'} animate-pulse`}>
                <div className="h-40 rounded-t-xl bg-gray-300 dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-14 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <FiGlobe className="mr-3 text-emerald-500" /> Explore Countries
            </h1>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className={`flex items-center px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent`}>
              <FiSearch className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full outline-none bg-transparent ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="ml-2 p-1 rounded-full hover:bg-gray-700/30 transition-colors"
                  aria-label="Clear search"
                >
                  <FiX className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setRegionFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${regionFilter === 'all' 
              ? 'bg-emerald-500 text-white' 
              : isDarkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            All Regions
          </button>
          
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setRegionFilter(region)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${regionFilter === region 
                ? 'bg-emerald-500 text-white' 
                : isDarkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {region}
            </button>
          ))}
        </div>
        {filteredCountries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCountries.map((country) => (
              <Link
                key={country.cca3}
                to={`/culture/${country.cca3.toLowerCase()}`}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-md border ${isDarkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'} hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="relative w-full aspect-video overflow-hidden">
                  <img 
                    src={country.flags.png} 
                    alt={`Flag of ${country.name.common}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-500 transition-colors">
                    {country.name.common}
                  </h3>
                  
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 mb-6">
              <FiInfo className="text-3xl text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No countries found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `We couldn't find any countries matching "${searchTerm}".` 
                : `No countries found in the ${regionFilter} region.`}
              Try adjusting your search or filters.
            </p>
            <button 
              onClick={resetFilters}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 inline-flex items-center"
            >
              <FiX className="mr-1" /> Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CultureHub;