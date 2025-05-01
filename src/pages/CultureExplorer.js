import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiLock } from 'react-icons/fi';
const CultureExplorer = () => {
  const { isDarkMode } = useTheme();
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        if (!countryResponse.ok) throw new Error('Country not found');
        const [countryData] = await countryResponse.json();
        setCountry(countryData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [countryCode]);

  if (loading) {
    return (
      <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse h-12 w-64 bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-96 bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-2xl shadow-xl"></div>
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gradient-to-r from-gray-800/20 to-gray-900/20 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
    <div className="max-w-7xl mx-auto text-center">
    <h1 className="text-3xl font-bold mb-4">Error loading country</h1>
    <p className="text-lg mb-6">{error}</p>
    <button
    onClick={() => navigate('/explore')}
    className={`px-6 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'} text-white transition-colors`}
    >
    Browse Countries
    </button>
    </div>
    </div>
    );
    }
  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
          <div className="relative group">
            <img 
              src={country.flags.png} 
              alt={`Flag of ${country.name.common}`} 
              className="w-48 h-32 object-cover rounded-2xl shadow-2xl border-4 border-emerald-500/20 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {country.name.common}
            </h1>
            <p className={`text-xl opacity-90 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {country.region}{country.subregion ? ` • ${country.subregion}` : ''}
                {country.capital && (
                    <span className="block md:inline-block mt-2 md:mt-0 md:ml-4">
                    <span className="text-emerald-500">🏛 </span>
                    {country.capital[0]}
                    </span>
                )}
            </p>
          </div>
        </div>
        <div className={`p-8 rounded-2xl mb-12 backdrop-blur-lg ${
          isDarkMode 
            ? 'bg-gray-800/40 shadow-xl shadow-emerald-500/10 border border-gray-700/50' 
            : 'bg-white/90 shadow-lg border border-gray-200/50'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent">
                  Nation Overview
                </h3>
                <div className="space-y-4">
                  <InfoItem 
                    label="Population" 
                    value={country.population?.toLocaleString()}
                    darkMode={isDarkMode}
                  />
                  <InfoItem 
                    label="Land Area" 
                    value={`${country.area?.toLocaleString()} km²`}
                    darkMode={isDarkMode}
                  />
                  <InfoItem 
                    label="Time Zones" 
                    value={country.timezones?.join(', ')}
                    darkMode={isDarkMode}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent">
                  Geographical Profile
                </h3>
                <div className="space-y-4">
                  <InfoItem 
                    label="Region" 
                    value={country.region}
                    darkMode={isDarkMode}
                  />
                  {country.subregion && (
                    <InfoItem 
                      label="Subregion" 
                      value={country.subregion}
                      darkMode={isDarkMode}
                    />
                  )}
                  {country.capital && (
                    <InfoItem 
                      label="Capital" 
                      value={country.capital[0]}
                      darkMode={isDarkMode}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-12 text-center p-8 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
            <div className="mb-6 flex justify-center">
              <FiLock className="text-4xl text-emerald-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Unlock Full Cultural Insights
            </h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
              Sign in to access detailed cultural information, traditional recipes, historical timelines, and interactive maps.
            </p>
            <Link
              to="/login"
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 inline-flex items-center gap-2"
            >
              <FiLock className="text-lg" /> Sign In to Explore Deeper
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, icon, darkMode }) => (
  <div className={`flex items-center p-4 rounded-xl ${
    darkMode 
      ? 'bg-gray-800/30 hover:bg-gray-700/40' 
      : 'bg-gray-50 hover:bg-gray-100'
  } transition-colors duration-200`}>
    <span className="text-2xl mr-4">{icon}</span>
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {value || 'N/A'}
      </div>
    </div>
  </div>
);

export default CultureExplorer;