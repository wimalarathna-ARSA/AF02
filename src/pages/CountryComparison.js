import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiCheck, FiFlag, FiMapPin, FiUsers, FiLayers, FiGlobe, FiDollarSign, FiClock, FiCalendar, FiActivity, FiArrowLeft } from 'react-icons/fi';

const CountryComparison = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([null, null, null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState([false, false, false]);
  const [searchTerms, setSearchTerms] = useState(['', '', '']);
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const toggleDropdown = (index) => {
    const newDropdownOpen = [...dropdownOpen];
    newDropdownOpen[index] = !newDropdownOpen[index];
    setDropdownOpen(newDropdownOpen);
    if (!newDropdownOpen[index]) {
      const newSearchTerms = [...searchTerms];
      newSearchTerms[index] = '';
      setSearchTerms(newSearchTerms);
    }
  };

  const handleCountrySelect = (country, index) => {
    const updatedCountries = [...selectedCountries];
    updatedCountries[index] = country;
    setSelectedCountries(updatedCountries);
    
    const newDropdownOpen = [...dropdownOpen];
    newDropdownOpen[index] = false;
    setDropdownOpen(newDropdownOpen);
    
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = '';
    setSearchTerms(newSearchTerms);
  };

  const handleSearchChange = (e, index) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = e.target.value;
    setSearchTerms(newSearchTerms);
  };

  const toggleRowExpand = (rowName) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowName]: !prev[rowName]
    }));
  };

  const filteredCountries = (index) => {
    return countries.filter(country => 
      country.name.common.toLowerCase().includes(searchTerms[index].toLowerCase())
    );
  };

  const getPopulationDensity = (country) => {
    if (!country.area || !country.population) return 'N/A';
    const density = (country.population / country.area).toFixed(2);
    return `${density} people/km²`;
  };

  const getCurrencyInfo = (country) => {
    if (!country.currencies) return 'N/A';
    return Object.entries(country.currencies)
      .map(([code, currency]) => `${currency.name} (${currency.symbol || code})`)
      .join(', ');
  };

  const getLanguageInfo = (country) => {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
  };

  const getTimeZoneInfo = (country) => {
    if (!country.timezones) return 'N/A';
    return country.timezones.join(', ');
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className={`w-16 h-16 border-4 ${isDarkMode ? 'border-gray-700 border-t-blue-400' : 'border-gray-300 border-t-blue-500'} rounded-full`}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-center p-8 ${isDarkMode ? 'bg-gray-800/80 border-gray-700/30' : 'bg-white/80 border-gray-200/30'} backdrop-blur-sm rounded-2xl shadow-lg border max-w-md w-full mx-4`}
        >
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-rose-400' : 'text-rose-500'} mb-4`}>Error Loading Countries</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className={`px-6 py-3 ${isDarkMode ? 'bg-gradient-to-r from-sky-500 to-rose-500 hover:from-sky-600 hover:to-rose-600' : 'bg-gradient-to-r from-sky-400 to-rose-400 hover:from-sky-500 hover:to-rose-500'} text-white rounded-lg transition-all duration-200 shadow-lg`}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/90 border-blue-100/30 backdrop-blur-sm'} rounded-2xl shadow-xl border p-6`}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className={`flex items-center ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              <FiArrowLeft className="mr-2" />
              Back
            </motion.button>
            <h1 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>Compare Countries</h1>
            <div className="w-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[0, 1, 2].map((index) => (
              <div key={index} className="relative">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'} mb-2`}>
                  Country {index + 1}
                </label>
                
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  onClick={() => toggleDropdown(index)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isDarkMode
                      ? 'bg-gray-700/50 border-gray-600/30 hover:border-gray-500 text-gray-200'
                      : 'bg-white border-gray-300 hover:border-blue-400 text-gray-900'
                  } ${dropdownOpen[index] ? (isDarkMode ? 'ring-2 ring-blue-500/50' : 'ring-2 ring-blue-400/50') : ''}`}
                >
                  <div className="flex items-center">
                    {selectedCountries[index]?.flags?.svg && (
                      <img 
                        src={selectedCountries[index].flags.svg} 
                        alt="Flag" 
                        className="w-6 h-4 mr-3 object-cover rounded-sm"
                      />
                    )}
                    <span className="truncate">
                      {selectedCountries[index]?.name.common || 'Select a country'}
                    </span>
                  </div>
                  {dropdownOpen[index] ? <FiChevronUp /> : <FiChevronDown />}
                </motion.div>
                
                <AnimatePresence>
                  {dropdownOpen[index] && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg overflow-hidden ${
                        isDarkMode 
                          ? 'bg-gray-700 border border-gray-600/30' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="p-2 border-b border-gray-200/30">
                        <input
                          type="text"
                          placeholder="Search countries..."
                          value={searchTerms[index]}
                          onChange={(e) => handleSearchChange(e, index)}
                          className={`w-full px-3 py-2 text-sm rounded-md ${
                            isDarkMode 
                              ? 'bg-gray-600/50 border-gray-500/30 text-white placeholder-gray-400' 
                              : 'bg-gray-100 border-gray-200 text-gray-800 placeholder-gray-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-400/50`}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountries(index).length > 0 ? (
                          filteredCountries(index).map((country) => (
                            <motion.div
                              key={country.cca3}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.1 }}
                              onClick={() => handleCountrySelect(country, index)}
                              className={`px-4 py-2 cursor-pointer transition-colors duration-150 flex items-center ${
                                selectedCountries[index]?.cca3 === country.cca3
                                  ? isDarkMode 
                                    ? 'bg-blue-600/30 text-blue-100' 
                                    : 'bg-blue-100 text-blue-800'
                                  : isDarkMode
                                    ? 'hover:bg-gray-600/50 text-gray-200'
                                    : 'hover:bg-gray-100 text-gray-800'
                              }`}
                            >
                              <img 
                                src={country.flags.svg} 
                                alt="Flag" 
                                className="w-5 h-3.5 mr-3 object-cover rounded-sm"
                              />
                              <span className="truncate">{country.name.common}</span>
                              {selectedCountries[index]?.cca3 === country.cca3 && (
                                <FiCheck className="ml-auto text-blue-500" />
                              )}
                            </motion.div>
                          ))
                        ) : (
                          <div className={`px-4 py-3 text-center ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            No countries found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {selectedCountries.some(country => country !== null) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${isDarkMode ? 'bg-gray-800/60 border-gray-700/30' : 'bg-white/90 border-blue-100/30 backdrop-blur-sm'} rounded-2xl shadow-xl border overflow-hidden`}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gradient-to-r from-blue-100 to-indigo-100'}`}>
                      <th className={`px-6 py-4 text-left ${isDarkMode ? 'text-gray-300' : 'text-blue-900'} font-medium`}>Property</th>
                      {selectedCountries.map((country, index) => (
                        <th key={index} className={`px-6 py-4 text-left ${isDarkMode ? 'text-gray-300' : 'text-blue-900'} font-medium`}>
                          {country ? (
                            <div className="flex items-center">
                              <img 
                                src={country.flags.svg} 
                                alt={`Flag of ${country.name.common}`} 
                                className="w-8 h-6 mr-3 object-cover rounded-sm"
                              />
                              {country.name.common}
                            </div>
                          ) : (
                            `Country ${index + 1}`
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}>
                      <td 
                        className={`px-6 py-3 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} font-medium cursor-pointer flex items-center`}
                        onClick={() => toggleRowExpand('basic')}
                      >
                        <FiFlag className="mr-2" />
                        Basic Information
                        {expandedRows['basic'] ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
                      </td>
                      {selectedCountries.map((country, index) => (
                        <td key={index} className={`px-6 py-3 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                          {country ? (
                            <div className="flex items-center">
                              <span className="truncate">{country.capital?.[0] || 'N/A'}</span>
                            </div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                    
                    <AnimatePresence>
                      {expandedRows['basic'] && (
                        <motion.tr 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                        >
                          <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Capital</td>
                          {selectedCountries.map((country, index) => (
                            <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                              {country?.capital?.[0] || 'N/A'}
                            </td>
                          ))}
                        </motion.tr>
                      )}
                    </AnimatePresence>

                    <tr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}>
                      <td 
                        className={`px-6 py-3 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} font-medium cursor-pointer flex items-center`}
                        onClick={() => toggleRowExpand('geo')}
                      >
                        <FiGlobe className="mr-2" />
                        Geography
                        {expandedRows['geo'] ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
                      </td>
                      {selectedCountries.map((country, index) => (
                        <td key={index} className={`px-6 py-3 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                          {country ? (
                            <div className="flex items-center">
                              <span className="truncate">{country.region}</span>
                            </div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                    
                    <AnimatePresence>
                      {expandedRows['geo'] && (
                        <>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Region</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country?.region || 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Subregion</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country?.subregion || 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Area (km²)</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country?.area ? country.area.toLocaleString() : 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                        </>
                      )}
                    </AnimatePresence>

                    <tr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}>
                      <td 
                        className={`px-6 py-3 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} font-medium cursor-pointer flex items-center`}
                        onClick={() => toggleRowExpand('population')}
                      >
                        <FiUsers className="mr-2" />
                        Population
                        {expandedRows['population'] ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
                      </td>
                      {selectedCountries.map((country, index) => (
                        <td key={index} className={`px-6 py-3 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                          {country ? (
                            <div className="flex items-center">
                              <span className="truncate">{country.population.toLocaleString()}</span>
                            </div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                    
                    <AnimatePresence>
                      {expandedRows['population'] && (
                        <>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Total</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country?.population.toLocaleString() || 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Density</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country ? getPopulationDensity(country) : 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                        </>
                      )}
                    </AnimatePresence>

                    <tr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}>
                      <td 
                        className={`px-6 py-3 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} font-medium cursor-pointer flex items-center`}
                        onClick={() => toggleRowExpand('economy')}
                      >
                        <FiDollarSign className="mr-2" />
                        Economy
                        {expandedRows['economy'] ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
                      </td>
                      {selectedCountries.map((country, index) => (
                        <td key={index} className={`px-6 py-3 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                          {country ? (
                            <div className="flex items-center">
                              <span className="truncate">{getCurrencyInfo(country)}</span>
                            </div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                    
                    <AnimatePresence>
                      {expandedRows['economy'] && (
                        <>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Currencies</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country ? getCurrencyInfo(country) : 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Gini Index</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country?.gini ? Object.entries(country.gini).map(([year, value]) => (
                                  <span key={year}>{year}: {value}</span>
                                )) : 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                        </>
                      )}
                    </AnimatePresence>

                    <tr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}>
                      <td 
                        className={`px-6 py-3 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} font-medium cursor-pointer flex items-center`}
                        onClick={() => toggleRowExpand('culture')}
                      >
                        <FiActivity className="mr-2" />
                        Culture
                        {expandedRows['culture'] ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
                      </td>
                      {selectedCountries.map((country, index) => (
                        <td key={index} className={`px-6 py-3 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                          {country ? (
                            <div className="flex items-center">
                              <span className="truncate">{getLanguageInfo(country)}</span>
                            </div>
                          ) : null}
                        </td>
                      ))}
                    </tr>
                    
                    <AnimatePresence>
                      {expandedRows['culture'] && (
                        <>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Languages</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country ? getLanguageInfo(country) : 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Time Zones</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country ? getTimeZoneInfo(country) : 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                          <motion.tr 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`${isDarkMode ? 'border-gray-700' : 'border-blue-100'} border-t`}
                          >
                            <td className={`px-6 py-2 ${isDarkMode ? 'text-gray-300' : 'text-blue-800'} pl-10`}>Driving Side</td>
                            {selectedCountries.map((country, index) => (
                              <td key={index} className={`px-6 py-2 ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                                {country?.drivingSide || 'N/A'}
                              </td>
                            ))}
                          </motion.tr>
                        </>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CountryComparison;