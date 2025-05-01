import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = storedUsers.some((user) => user.email === email);
      
      if (userExists) {
        setError('User already exists with this email');
        setIsLoading(false);
        return;
      }

      const newUser = { username, email, password };
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));

      login(newUser);
      navigate('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      
      <div className="mt-6 mb-6 max-w-md w-full mx-4 z-10">
        <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/95 border-gray-200/50'} backdrop-blur-lg rounded-2xl shadow-xl border transition-all duration-300 hover:shadow-2xl`}>
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className={`relative h-20 w-20 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'} flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-20 w-20 animate-spin-slow">
                    <defs>
                      <linearGradient id="twistGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00c6ff" />
                        <stop offset="100%" stopColor="#7ed957" />
                      </linearGradient>
                      <linearGradient id="twistGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7ed957" />
                        <stop offset="100%" stopColor="#00c6ff" />
                      </linearGradient>
                      <style>
                        {`
                          .animate-spin-slow {
                            animation: spin 50s linear infinite;
                          }
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}
                      </style>
                    </defs>
                    <path d="M256 30 C340 10, 470 100, 420 180 C400 250, 300 200, 260 180 C220 160, 200 100, 256 30" fill="url(#twistGradient1)" />
                    <path d="M256 482 C170 502, 42 412, 92 332 C112 262, 212 312, 252 332 C292 352, 312 412, 256 482" fill="url(#twistGradient2)" />
                  </svg>
                  <div className={`absolute inset-0 rounded-full border-2 ${isDarkMode ? 'border-teal-400/30' : 'border-blue-400/30'} animate-ping opacity-75`}></div>
                </div>
              </div>
              <h2 className={`text-xs font-semibold tracking-wider ${isDarkMode ? 'text-teal-400' : 'text-blue-500'} uppercase mb-1`}>WorldQuery</h2>
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Your Account</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 text-sm`}>Join us to start your journey</p>
            </div>

            {error && (
              <div className={`mb-6 p-3 ${isDarkMode ? 'bg-red-900/50 border-red-700/30' : 'bg-red-100 border-red-200'} rounded-lg border flex items-center`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill={isDarkMode ? '#F87171' : '#DC2626'}
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className={`${isDarkMode ? 'text-red-300' : 'text-red-600'} text-sm`}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Username
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700/70 border-gray-600/50 text-white placeholder-gray-400 focus:ring-teal-500/50' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50'} border focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700/70 border-gray-600/50 text-white placeholder-gray-400 focus:ring-teal-500/50' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50'} border focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700/70 border-gray-600/50 text-white placeholder-gray-400 focus:ring-teal-500/50' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50'} border focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700/70 border-gray-600/50 text-white placeholder-gray-400 focus:ring-teal-500/50' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50'} border focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-teal-500/50 focus:ring-offset-gray-800' : 'focus:ring-blue-500/50 focus:ring-offset-white'} flex items-center justify-center ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm text-center`}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className={`${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-blue-600 hover:text-blue-500'} font-medium transition-colors`}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;