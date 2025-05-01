import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiMapPin, FiGlobe, FiDollarSign,FiUsers, FiFlag, FiTruck } from 'react-icons/fi';

const CountryDetail = () => {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [neighbors, setNeighbors] = useState([]);
  const [neighborsLoading, setNeighborsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { isAuthenticated, toggleFavorite, isFavorite } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchCountry = async () => {
      if (!countryCode) {
        setError('No country code provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        let response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}?fields=name,flags,capital,region,subregion,population,languages,currencies,borders,latlng,coatOfArms,timezones,continents,startOfWeek,car,postalCode,idd,area,independent,unMember,landlocked,status,drivingSide,gini,maps,cca2,cca3,cioc,tld,translations`);
        
        if (!response.ok) {
          response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode.toLowerCase()}?fields=name,flags,capital,region,subregion,population,languages,currencies,borders,latlng,coatOfArms,timezones,continents,startOfWeek,car,postalCode,idd,area,independent,unMember,landlocked,status,drivingSide,gini,maps,cca2,cca3,cioc,tld,translations`);
          
          if (!response.ok) throw new Error(`Country not found with code: ${countryCode}`);
        }
        
        const data = await response.json();
        const countryData = Array.isArray(data) ? data[0] : data;
        
        if (!countryData.name || !countryData.flags) {
          throw new Error('Invalid country data structure');
        }
        
        setCountry(countryData);
        setError('');
        
        if (countryData.borders?.length > 0) {
          fetchNeighbors(countryData.borders);
        }
      } catch (err) {
        console.error('Error fetching country:', err);
        setError(err.message);
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchNeighbors = async (borderCodes) => {
      try {
        setNeighborsLoading(true);
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}&fields=name,flags,cca3`);
        const data = await response.json();
        setNeighbors(data);
      } catch (err) {
        console.error('Error fetching neighbors:', err);
      } finally {
        setNeighborsLoading(false);
      }
    };

    fetchCountry();
  }, [countryCode]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 border-4 ${isDarkMode ? 'border-gray-700 border-t-blue-400' : 'border-gray-300 border-t-blue-500'} rounded-full mx-auto`}
          />
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'} font-medium`}
          >
            Loading country details...
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}
          >
            Fetching data for {countryCode}
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-center p-8 ${isDarkMode ? 'bg-gray-800/80 border-gray-700/30' : 'bg-white/80 border-gray-200/30'} backdrop-blur-sm rounded-2xl shadow-lg border max-w-md w-full mx-4`}
        >
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-rose-400' : 'text-rose-500'} mb-4`}>Error Loading Country</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{error || 'Unable to load country details'}</p>
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

  const formatWeekStart = (day) => {
    return day === 'monday' ? 'Monday' : day === 'sunday' ? 'Sunday' : day;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-sky-900/50 border-sky-800/30' : 'bg-blue-50/80 border-blue-100/50'} border`}>
                <h3 className="flex items-center text-lg font-semibold mb-3">
                  <FiMapPin className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span  className={`${isDarkMode ? 'text-sky-300' : 'text-blue-900'} mb-2`}>Geography</span>
                </h3>
                <div className="space-y-2">
                <span className={isDarkMode ? 'text-blue-200 font-medium' : 'text-blue-600 font-medium'}>
                <p>Capital:{' '}
                {country.capital?.[0] || 'N/A'}
                </p>
                </span>
                <span className={isDarkMode ?  'text-cyan-300' : 'text-cyan-900 font-medium'}>
                <p>Region:{' '}
                  {country.region}{country.subregion ? `, ${country.subregion}` : ''}
                  </p>
                </span>
                <span className={isDarkMode ?  'text-sky-300' : 'text-blue-900 font-medium'}>
                <p>Area:{' '}
                  {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}
                 </p>
                {country.landlocked && (
                  <p>Landlocked:{' '}Yes</p>
                )}
                </span>
              </div>
                </div>

              <div className={`p-5 rounded-xl ${isDarkMode ?  'bg-green-900/50 border-green-800/30' : 'bg-green-50/80 border-green-100/50'} border`}>
                <h3 className="flex items-center text-lg font-semibold mb-3">
                  <FiUsers className={`mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={isDarkMode ? 'text-green-300' : 'text-green-900'}>Demographics</span>
                </h3>
               
                <div className="space-y-2">
                  <p><span  className={isDarkMode ? 'text-green-300' : 'text-green-900 font-medium'}>Population:</span>  <span className={isDarkMode ? 'text-green-200' : 'text-green-800'}> {country.population.toLocaleString()}</span></p>
                  {country.gini && (
                    <p>
                      <span  className={isDarkMode ? 'text-emerald-300' : 'text-emerald-900 font-medium'}>Gini Index:</span> <span  className={isDarkMode ?  'text-gray-200' : 'text-emerald-800 font-medium'}>{Object.entries(country.gini).map(([year, value]) => (
                        <span key={year}>{year}: {value}</span>
                      ))}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-purple-900/50 border-purple-800/30' : 'bg-purple-50/80 border-purple-100/50'} border`}>
                <h3 className="flex items-center text-lg font-semibold mb-3">
                  <FiGlobe className={`mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={isDarkMode ? 'text-purple-300' : 'text-purple-900'}>Culture</span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                  <span className={isDarkMode ? 'text-gray-200' : 'text-purple-800'}>
                    <h4 className="font-medium mb-1">Languages</h4>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(country.languages || {}).map(([code, name]) => (
                        <span 
                          key={code} 
                          className={`px-2 py-1 rounded-md text-sm ${isDarkMode ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800'}`}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                  <span className={isDarkMode ? 'text-indigo-300' : 'text-indigo-900'}>
                    <h4 className="font-medium mb-1">Week Starts On</h4>
                    </span>
                    <span className={isDarkMode ? 'text-gray-200' : 'text-indigo-800'}>
                    <p>{country.startOfWeek ? formatWeekStart(country.startOfWeek) : 'N/A'}</p>
                    </span>
                  </div>
                </div>
                
              </div>

              <div className={`p-5 rounded-xl ${isDarkMode ?  'bg-amber-900/50 border-amber-800/30' : 'bg-amber-50/80 border-amber-100/50'} border`}>
                <h3 className="flex items-center text-lg font-semibold mb-3">
                  <FiDollarSign className={`mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <span className={isDarkMode ? 'text-amber-300' : 'text-amber-900'}>Economy</span>
                </h3>
               
                <div className="space-y-2">
                <span className={isDarkMode ?  'text-amber-100' : 'text-amber-800 font-medium'}>
                  <h4 className="font-medium">Currencies</h4>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(country.currencies || {}).map(([code, currency]) => (
                      <span 
                        key={code} 
                        className={`px-2 py-1 rounded-md text-sm ${isDarkMode ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {currency.name} ({currency.symbol || code})
                      </span>
                    ))}
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        );
      
      case 'government':
        return (
          <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-rose-900/50 border-rose-800/30' : 'bg-rose-50/80 border-rose-100/50'} border`}>
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <FiFlag className={`mr-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>Government & Politics</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <span className={isDarkMode ?  'text-rose-200' : 'text-rose-800'}>
                <h4 className="font-medium mb-2">Status</h4>
                </span>
                <span className={isDarkMode ? 'text-rose-300' : 'text-rose-600 font-medium'}>
                <p>{country.status || 'N/A'}</p>
                <p className="mt-2"><span className="font-medium">Independent:</span> {country.independent ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">UN Member:</span> {country.unMember ? 'Yes' : 'No'}</p>
                </span>
              </div>
              <div>
              <span className={isDarkMode ?  'text-pink-300' : 'text-pink-900'}>
                <h4 className="font-medium mb-2">Country Codes</h4>
                </span>
                <span className={isDarkMode ? 'text-pink-100' : 'text-pink-800'}>
                <p><span className="font-medium">CCA2:</span> {country.cca2}</p>
                <p><span className="font-medium">CCA3:</span> {country.cca3}</p>
                {country.cioc && <p><span className="font-medium">CIOC:</span> {country.cioc}</p>}
                {country.tld && <p><span className="font-medium">TLD:</span> {country.tld.join(', ')}</p>}
                </span>
              </div>
            </div>
          </div>
        );
      
      case 'transport':
        return (
          <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-orange-900/50 border-orange-800/30' : 'bg-orange-50/80 border-orange-100/50'} border`}>
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <FiTruck className={`mr-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <span className={isDarkMode ?  'text-orange-300' : 'text-orange-900'}>Transportation</span>
            </h3>
            <div className="space-y-3">
              {country.car?.signs && (
                <div>
                  <span className={isDarkMode ? 'text-orange-200' : 'text-orange-800 font-medium'}>
                  <h4 className="font-medium">Car Signs</h4>
                  </span>
                  <div className="flex gap-2 mt-1">
                    {country.car.signs.map((sign, i) => (
                      <span 
                        key={i} 
                        className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-orange-900/50 text-orange-200' : 'bg-orange-100 text-orange-800'}`}
                      >
                        {sign}
                      </span>
                    ))}
                  </div>
                  
                </div>
              )}
              
              {country.drivingSide && (
                 <span className={isDarkMode ?  'text-yellow-300' : 'text-yellow-900'}>
                <p><span className="font-medium">Driving Side:</span> {country.drivingSide}</p>
                </span>
              )}
              {country.postalCode?.format && (
                <p><span className={isDarkMode ?  'text-yellow-300' : 'text-yellow-900 font-medium'}>Postal Code Format:</span> <span className={isDarkMode ?   'text-yellow-200' : 'text-yellow-800'}>{country.postalCode.format}</span></p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`fixed inset-0 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'} -z-10`} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800/80 border-gray-700/30' : 'bg-white/90 border-gray-200/30'} border backdrop-blur-sm`}
        >
          <div className="relative h-64 sm:h-80">
            <img
              src={country.flags.svg || country.flags.png}
              alt={`Flag of ${country.name.common}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {country.name.common}
              </h1>
              <p className="text-white/90 text-sm sm:text-base">{country.name.official}</p>
              {country.translations && (
                <p className="text-white/80 text-xs sm:text-sm mt-1">
                  {country.name.nativeName ? Object.values(country.name.nativeName)[0].common : country.name.common}
                </p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(country.cca3)}
              className={`absolute top-4 right-4 p-2 ${isDarkMode ? 'bg-gray-800/80 hover:bg-gray-700' : 'bg-white/90 hover:bg-white'} rounded-full transition-colors duration-200 shadow-lg`}
              title={isFavorite(country.cca3) ? "Remove from favorites" : "Add to favorites"}
            >
              <FiHeart
                className={`h-6 w-6 ${isFavorite(country.cca3) ? 'fill-rose-500 text-rose-500' : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}
              />
            </motion.button>
          </div>
          <div className="p-6 sm:p-8">
            {country.coatOfArms?.png && (
              <div className="flex justify-center mb-8">
                <div className={`p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg text-center`}>
                  <h3 className={`flex items-center justify-center font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-600'} mb-2`}>
                   Coat of Arms
                  </h3>
                  <img 
                    src={country.coatOfArms.png} 
                    alt={`Coat of Arms of ${country.name.common}`} 
                    className="h-32 object-contain mx-auto"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            <div className="flex border-b mb-6">
              {['overview', 'government', 'transport'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium text-sm sm:text-base relative ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="tabIndicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}
                    />
                  )}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
            {country.borders && country.borders.length > 0 && (
              <div className="mt-8">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
                  <FiGlobe className="mr-2" /> Neighboring Countries
                </h3>
                {neighborsLoading ? (
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`w-8 h-8 border-2 ${isDarkMode ? 'border-gray-600 border-t-blue-400' : 'border-gray-300 border-t-blue-500'} rounded-full`}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {neighbors.map(neighbor => (
                      <motion.div 
                        key={neighbor.cca3}
                        whileHover={{ y: -5 }}
                        onClick={() => navigate(`/country/${neighbor.cca3}`)}
                        className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} rounded-lg p-3 shadow cursor-pointer transition-all duration-200 flex flex-col items-center`}
                      >
                        <img 
                          src={neighbor.flags.png} 
                          alt={`Flag of ${neighbor.name.common}`} 
                          className="w-16 h-12 object-cover mb-2 rounded"
                          loading="lazy"
                        />
                        <p className={`text-center text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {neighbor.name.common}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className={`px-6 py-3 ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400'} text-white rounded-lg transition-all duration-200 shadow-lg flex items-center`}
              >
                <FiArrowLeft className="mr-2" /> Back to Home
              </motion.button>
              
              {country?.maps?.googleMaps && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 ${isDarkMode ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500' : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400'} text-white rounded-lg transition-all duration-200 shadow-lg flex items-center`}
                >
                  <FiMapPin className="mr-2" /> Google Maps
                </motion.a>
              )}

              {country?.maps?.openStreetMaps && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={country.maps.openStreetMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 ${isDarkMode ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400'} text-white rounded-lg transition-all duration-200 shadow-lg flex items-center`}
                >
                  <FiGlobe className="mr-2" /> OpenStreetMap
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CountryDetail;