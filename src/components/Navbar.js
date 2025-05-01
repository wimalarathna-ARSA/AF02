import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 ${isDarkMode ? 'bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95' : 'bg-gradient-to-r from-white/95 via-gray-50/95 to-white/95'} backdrop-blur-md border-b ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'} shadow-lg ${isDarkMode ? 'shadow-gray-900/20' : 'shadow-gray-300/20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              WorldQuery
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-amber-300' : 'bg-gray-100 hover:bg-gray-200 text-amber-500'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-5">
                  <Link
                    to="/compare"
                    className={`relative px-5 py-2.5 font-medium rounded-lg group transition-all duration-300 overflow-hidden ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <span className="relative z-10 flex items-center text-teal-400 group-hover:text-gray-600">
                      Compare
                    </span>
                    <span className={`absolute inset-0 test-black bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`}></span>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`hidden md:flex items-center ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${isDarkMode ? 'bg-gray-700' : 'bg-emerald-100'}`}>
                      <span className="font-medium">{user.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium">Hi, {user.username.split(' ')[0]}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="relative px-5 py-2.5 font-medium rounded-lg group transition-all duration-300 overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-emerald-500/20"
                  >
                    <span className="relative z-10 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </span>
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="relative px-5 py-2.5 font-medium rounded-lg group transition-all duration-300 overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-emerald-500/20"
              >
                <span className="relative z-10 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;