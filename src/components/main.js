import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Main = () => {
  const { isDarkMode } = useTheme();
  const globeEl = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(null);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.8;
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 1000);
    }
    setIsVisible(true);
  }, []);

  const globeImageUrl = isDarkMode
    ? '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    : '//unpkg.com/three-globe/example/img/earth-day.jpg';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  const featureVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }),
    hover: {
      y: -10,
      boxShadow: isDarkMode 
        ? "0 20px 25px -5px rgba(56, 178, 172, 0.2), 0 10px 10px -5px rgba(56, 178, 172, 0.04)"
        : "0 20px 25px -5px rgba(99, 102, 241, 0.2), 0 10px 10px -5px rgba(99, 102, 241, 0.04)"
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center px-4 overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50'}`}>
      <motion.div 
        className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20' : 'bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-blue-400/10'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        <Globe
          ref={globeEl}
          globeImageUrl={globeImageUrl}
          backgroundColor="rgba(0,0,0,0)"
          width={window.innerWidth}
          height={window.innerHeight}
          onGlobeReady={() => {
            globeEl.current.controls().autoRotateSpeed = 0.8;
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 1000);
          }}
        />
      </motion.div>

      <motion.div 
        className="text-center max-w-2xl z-10 mt-10 mb-10"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div 
          className={`${isDarkMode ? 'bg-gray-900/40' : 'bg-white/40'} backdrop-blur-lg rounded-3xl p-8 shadow-2xl border ${isDarkMode ? 'border-gray-800/30' : 'border-white/30'}`}
          variants={itemVariants}
          whileHover={{ 
            boxShadow: isDarkMode 
              ? "0 25px 50px -12px rgba(56, 178, 172, 0.25)" 
              : "0 25px 50px -12px rgba(99, 102, 241, 0.25)"
          }}
        >
          <motion.h1 
            className={`text-4xl sm:text-6xl font-extrabold mb-6 leading-tight ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700'}`}
            variants={itemVariants}
          >
            Explore Countries <br /> Around the World
          </motion.h1>
          <motion.p 
            className={`mb-8 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            variants={itemVariants}
          >
            Discover cultures, languages, and geography of countries with just a few clicks.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/login"
                className={`px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                  ${isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'}
                `}
              >
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/signup"
                className={`px-8 py-4 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                  ${isDarkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-200 border border-gray-700/50' 
                    : 'bg-white/50 hover:bg-white/70 text-gray-800 border border-gray-200/50'}
                `}
              >
                Create Account
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
   
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {[
            {
              icon: (
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ),
              title: "Interactive Maps",
              description: "Explore countries with our interactive and detailed maps.",
              bgColor: isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10',
              textColor: isDarkMode ? 'text-blue-400' : 'text-blue-600',
              hoverColor: isDarkMode ? 'from-blue-500/30 to-blue-600/20' : 'from-blue-400/20 to-blue-500/20',
              link: "/map" 
            },
            {
              icon: (
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ),
              title: "Detailed Information",
              description: "Access comprehensive data about countries, including demographics and culture.",
              bgColor: isDarkMode ? 'bg-purple-500/20' : 'bg-purple-500/10',
              textColor: isDarkMode ? 'text-purple-400' : 'text-purple-600',
              hoverColor: isDarkMode ? 'from-purple-500/30 to-purple-600/20' : 'from-purple-400/20 to-purple-500/20',
              link: "/culture" 
            },
            {
              icon: (
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ),
              title: "Save Favorites",
              description: "Keep track of your favorite countries and access them anytime.",
              bgColor: isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-500/10',
              textColor: isDarkMode ? 'text-cyan-400' : 'text-cyan-600',
              hoverColor: isDarkMode ? 'from-cyan-500/30 to-cyan-600/20' : 'from-cyan-400/20 to-cyan-500/20',
              link: "/login" 
            }
          ].map((feature, i) => (
            <Link to={feature.link} key={i}>
              <motion.div 
                className={`${isDarkMode ? 'bg-gray-900/40' : 'bg-white/40'} backdrop-blur-lg rounded-xl p-6 shadow-lg border ${isDarkMode ? 'border-gray-800/30' : 'border-white/30'} relative overflow-hidden cursor-pointer`}
                variants={featureVariants}
                custom={i}
                whileHover="hover"
                onMouseEnter={() => setIsHovered(i)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <AnimatePresence>
                  {isHovered === i && (
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${feature.hoverColor} z-0`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
                <div className="relative z-10">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{feature.title}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div> 
      </motion.div>
    </div>
  );
};

export default Main;