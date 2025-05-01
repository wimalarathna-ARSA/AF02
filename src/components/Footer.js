import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Globe from 'react-globe.gl';
import reactLogo from './react.png';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiExternalLink, FiMail, FiMapPin, FiPhone, FiShield, FiFileText, FiChevronDown } from 'react-icons/fi';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const globeEl = useRef();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1.2;
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 1.5 }, 0);
    }
  }, []);

  const globeImageUrl = isDarkMode
    ? '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    : '//unpkg.com/three-globe/example/img/earth-day.jpg';

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const footerLinks = {
    quickLinks: [
      { name: 'All Countries', path: '/culture' },
      { name: 'Interactive Maps', path: '/map' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy', icon: <FiShield /> },
      { name: 'Terms of Service', path: '/terms', icon: <FiFileText /> },

    ]
  };

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`px-6 sm:px-10 py-8 border-t relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 text-gray-300' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50 border-blue-200 text-gray-700'}`}
    >
      <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'opacity-5' : 'opacity-10'}`}>
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-400 filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-emerald-400 filter blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <motion.div 
            className="text-center md:text-left"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="relative w-[50px] h-[50px]">
                <Globe
                  ref={globeEl}
                  globeImageUrl={globeImageUrl}
                  backgroundColor="rgba(0,0,0,0)"
                  width={50}
                  height={50}
                />
                <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'border-blue-500/30' : 'border-blue-400/30'} border-2 pointer-events-none`} />
              </div>
              <div>
                <p className={`font-bold text-xl bg-clip-text ${isDarkMode ? 'text-transparent bg-gradient-to-r from-blue-400 to-emerald-400' : 'text-transparent bg-gradient-to-r from-blue-600 to-emerald-600'}`}>
                  WorldQuery
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Explore Our Planet</p>
              </div>
            </div>
            <p className="mb-6 max-w-xs mx-auto md:mx-0 text-sm leading-relaxed">
              Your interactive portal to global cultures, statistics, and geographical wonders.
            </p>
            
            <div className="flex justify-center md:justify-start gap-4">
              {[
                { icon: <FiGithub />, url: "https://github.com/wimalarathna-ARSA", label: "GitHub" },
                { icon: <FiLinkedin />, url: "https://www.linkedin.com/in/sammani-wimalarathna-arsa/", label: "LinkedIn" },
                { icon: <FiMail />, url: "mailto:contact@worldquery.com", label: "Email" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-all duration-300 relative overflow-hidden group`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                  onMouseEnter={() => setHoveredLink(index)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span className="relative z-10">{social.icon}</span>
                  <AnimatePresence>
                    {hoveredLink === index && (
                      <motion.span 
                        className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-400/20'}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.a>
              ))}
            </div>
          </motion.div>
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('quickLinks')}
              className={`w-full flex justify-between items-center py-3 px-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <h3 className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Quick Links</h3>
              <motion.div
                animate={{ rotate: expandedSection === 'quickLinks' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronDown />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSection === 'quickLinks' && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`overflow-hidden ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} rounded-b-lg`}
                >
                  {footerLinks.quickLinks.map((link, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a 
                        href={link.path}
                        className={`block py-2 px-6 text-sm ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <motion.div 
            className="hidden md:block text-center md:text-left"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`font-semibold text-lg mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <a 
                    href={link.path} 
                    className={`flex items-center gap-2 text-sm ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            className="text-center md:text-left"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`font-semibold text-lg mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Contact Us</h3>
            <ul className="space-y-4">
              {[
                { icon: <FiMail />, text: 'contact@worldquery.com' },
                { icon: <FiPhone />, text: '+94 12 123 1234' },
                { icon: <FiMapPin />, text: 'Colombo, Sri Lanka', link: 'https://maps.google.com/?q=Colombo,Sri+Lanka' }
              ].map((contact, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center justify-center md:justify-start gap-3"
                  whileHover={{ x: 3 }}
                >
                  <span className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-200 text-blue-600'}`}>
                    {contact.icon}
                  </span>
                  <a 
                    href={contact.link} 
                    className={`text-sm hover:underline ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                  >
                    {contact.text}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('legal')}
              className={`w-full flex justify-between items-center py-3 px-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <h3 className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Legal & Resources</h3>
              <motion.div
                animate={{ rotate: expandedSection === 'legal' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronDown />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedSection === 'legal' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`overflow-hidden ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} rounded-b-lg`}
                >
                  <ul className="space-y-2 py-2">
                    {footerLinks.legal.map((link, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <a 
                          href={link.path}
                          className={`flex items-center gap-2 py-2 px-6 text-sm ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                        >
                          <span className="text-sm">{link.icon}</span>
                          {link.name}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="px-6 py-3 border-t border-opacity-20">
                    <h4 className="font-medium mb-2 text-sm">Data Sources</h4>
                    <a
                      href="https://restcountries.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      REST Countries API
                      <FiExternalLink className="ml-1 w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div 
            className="hidden md:block text-center md:text-left"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`font-semibold text-lg mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Legal</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.legal.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <a 
                    href={link.path} 
                    className={`flex items-center gap-2 text-sm ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}
                  >
                    <span className="text-sm">{link.icon}</span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div>
              <h4 className="font-medium mb-2 text-sm">Data Sources</h4>
              <motion.a
                href="https://restcountries.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                whileHover={{ x: 2 }}
              >
                REST Countries API
                <FiExternalLink className="ml-1 w-3 h-3" />
              </motion.a>
            </div>
          </motion.div>
        </div>
        <div className="pt-6 border-t border-opacity-20 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div 
            className="flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-sm">Made with</span>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 1 }}>
              <img 
                src={reactLogo} 
                alt="React Logo" 
                className="w-5 h-5" 
              />
            </motion.div>
            <span className="text-sm">React </span>
          </motion.div>
          <motion.p 
            className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
            whileHover={{ y: -2 }}
          >
            &copy; {new Date().getFullYear()} WorldQuery. All rights reserved.
          </motion.p>
          <motion.div
            className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} flex items-center gap-2`}
            whileHover={{ scale: 1.05 }}
          >
            <span>Version 1.0.0</span>
            <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;