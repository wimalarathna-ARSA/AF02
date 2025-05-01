import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const { isAuthenticated, favorites, toggleFavorite, isFavorite } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        setCountries(data);
        const languages = new Set();
        data.forEach(country => {
          if (country.languages) {
            Object.values(country.languages).forEach(lang => languages.add(lang));
          }
        });
        setAvailableLanguages(Array.from(languages).sort());
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.common.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !regionFilter || country.region === regionFilter;
    const matchesLanguage = !languageFilter || (country.languages && Object.values(country.languages).includes(languageFilter));
    const matchesFavorites = !showFavorites || isFavorite(country.cca3);
    return matchesSearch && matchesRegion && matchesLanguage && matchesFavorites;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setRegionFilter('');
    setLanguageFilter('');
    setShowFavorites(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 ${isDarkMode ? 'border-gray-700 border-t-gray-500/10' : 'border-gray-300 border-t-gray-100'} rounded-full animate-spin mx-auto`}></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Loading countries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} font-medium`}>Error fetching countries: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-blue-50'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-black/10 border-gray-200'} rounded-lg shadow-sm border p-6 mb-8`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-green-700'} mb-2`}>Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border focus:outline-none focus:ring-1 focus:ring-blue-500/10 focus:border-transparent`}
                />
                <svg
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-green-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <label htmlFor="region-select" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-green-700'} mb-2`}>Region</label>
              <select
                id="region-select"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className={`w-full pl-4 pr-10 py-3 rounded-lg border appearance-none transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-900/90 border-gray-600/30 hover:border-gray-500 text-gray-200 focus:ring-2 focus:ring-blue-500/50'
                    : 'bg-white border-gray-300 hover:border-blue-400 text-gray-900 focus:ring-2 focus:ring-blue-400/50'
                } focus:outline-none focus:border-transparent cursor-pointer`}
              >
                <option value="">All Regions</option>
                <option value="Africa">Africa</option>
                <option value="Americas">Americas</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>
            <div>
              <label htmlFor="language-select" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-green-700'} mb-2`}>Language</label>
              <select
                id="language-select"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className={`w-full pl-4 pr-10 py-3 rounded-lg border appearance-none transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-900/90 border-gray-600/30 hover:border-gray-500 text-gray-200 focus:ring-2 focus:ring-blue-500/50'
                    : 'bg-white border-gray-300 hover:border-blue-400 text-gray-900 focus:ring-2 focus:ring-blue-400/50'
                } focus:outline-none focus:border-transparent cursor-pointer`}
              >
                <option value="">All Languages</option>
                {availableLanguages.map(language => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`w-full px-4 py-2 rounded-md border transition-colors ${
                  showFavorites
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-green-100/30 border-green-800 text-green-700 hover:bg-green-100/60'
                }`}
              >
                {showFavorites ? 'Show All' : 'Show Favorites'}
              </button>
            </div>
          </div>
          {(searchTerm || regionFilter || languageFilter || showFavorites) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-grr-500/10 text-blue-600 border-blue-200'} border`}>
                    Search: {searchTerm}
                    <button
                      onClick={() => setSearchTerm('')}
                      className={`ml-2 ${isDarkMode ? 'hover:text-blue-300' : 'hover:text-blue-500'}`}
                    >
                      ×
                    </button>
                  </span>
                )}
                {regionFilter && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-100 text-rose-600 border-rose-200'} border`}>
                    Region: {regionFilter}
                    <button
                      onClick={() => setRegionFilter('')}
                      className={`ml-2 ${isDarkMode ? 'hover:text-rose-300' : 'hover:text-rose-500'}`}
                    >
                      ×
                    </button>
                  </span>
                )}
                {languageFilter && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-100 text-blue-600 border-blue-200'} border`}>
                    Language: {languageFilter}
                    <button
                      onClick={() => setLanguageFilter('')}
                      className={`ml-2 ${isDarkMode ? 'hover:text-blue-300' : 'hover:text-blue-500'}`}
                    >
                      ×
                    </button>
                  </span>
                )}
                {showFavorites && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border-emerald-200'} border`}>
                    Favorites Only
                    <button
                      onClick={() => setShowFavorites(false)}
                      className={`ml-2 ${isDarkMode ? 'hover:text-emerald-300' : 'hover:text-emerald-500'}`}
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'}`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
           <Link
           key={country.cca3}
           to={`/country/${country.cca3}`}
           className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-blue-400'} relative rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:border-blue-500/20 hover:scale-[1.02] backdrop-blur-sm group`}
         >
           <div className="flex items-center p-4 gap-4">
             <div className="w-1/3 h-24 relative group">
               <img
                 src={country.flags.png}
                 alt={`Flag of ${country.name.common}`}
                 className="w-full h-full object-cover rounded-lg cursor-pointer"
               />
               <div className="absolute inset-0 z-50 flex justify-center items-center group-hover:flex hidden">
                 <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mt-2 w-64 ${isDarkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'} p-2 rounded-lg border shadow-2xl transition-all duration-300 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100`}>
                   <img
                     src={country.flags.svg || country.flags.png}
                     alt={`Popup Flag of ${country.name.common}`}
                     className="w-full h-auto object-contain rounded"
                   />
                 </div>
               </div>
             </div>
             <div className="flex-1">
               <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} mb-1`}>
                 {country.name.common}
               </h2>
               <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                 <span className={isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'}>Population:</span>{' '}
                 <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                   {country.population.toLocaleString()}
                 </span>
               </p>
               <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                 <span className={isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'}>Region:</span>{' '}
                 <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{country.region}</span>
               </p>
               <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                 <span className={isDarkMode ? 'text-blue-400/70' : 'text-blue-600/70'}>Capital:</span>{' '}
                 <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                   {country.capital?.[0] || 'N/A'}
                 </span>
               </p>
             </div>
             <button
               onClick={(e) => {
                 e.preventDefault();
                 toggleFavorite(country.cca3);
               }}
               title={isFavorite(country.cca3) ? 'Remove from favorites' : 'Add to favorites'}
               className={`self-start p-1.5 ${isDarkMode ? 'bg-gray-900/90 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-full shadow-lg transition-colors duration-200`}
             >
               <svg
                 className={`w-4 h-4 ${
                   isFavorite(country.cca3) ? 'text-emerald-400 fill-current' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                 }`}
                 fill={isFavorite(country.cca3) ? 'currentColor' : 'none'}
                 stroke="currentColor"
                 viewBox="0 0 24 24"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   strokeWidth={2}
                   d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                 />
               </svg>
             </button>
           </div>
         
           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-800/60 backdrop-blur-md text-white text-sm font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl">
             Explore details
           </div>
         </Link>
         
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 