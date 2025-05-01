import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const customIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const GeocoderControl = () => {
  const map = useMap();
  const { isDarkMode } = useTheme();

  const applyGeocoderStyles = () => {
    const searchContainer = document.querySelector('.leaflet-control-geocoder');
    if (!searchContainer) return;

    searchContainer.style.borderRadius = '12px';
    searchContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    searchContainer.style.background = isDarkMode ? '#1f2937' : 'white';
    searchContainer.style.padding = '12px';
    searchContainer.style.border = `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`;
    searchContainer.style.transition = 'all 0.3s ease';

    const searchInput = searchContainer.querySelector('input');
    if (searchInput) {
      searchInput.style.border = `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`;
      searchInput.style.borderRadius = '8px';
      searchInput.style.padding = '10px 14px';
      searchInput.style.width = '280px';
      searchInput.style.fontSize = '14px';
      searchInput.style.backgroundColor = isDarkMode ? '#1f2937' : 'white';
      searchInput.style.color = isDarkMode ? '#f3f4f6' : '#1f2937';
      searchInput.style.transition = 'all 0.3s ease';
      searchInput.style.outline = 'none';
      searchInput.style.boxShadow = 'none';
    }

    const searchButton = searchContainer.querySelector('.leaflet-control-geocoder-icon');
    if (searchButton) {
      searchButton.style.borderRadius = '8px';
      searchButton.style.padding = '8px';
      searchButton.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
      searchButton.style.border = 'none';
      searchButton.style.boxShadow = 'none';
      searchButton.style.color = isDarkMode ? '#f3f4f6' : '#1f2937';
    }

    const resultsContainer = searchContainer.querySelector('.leaflet-control-geocoder-alternatives');
    if (resultsContainer) {
      resultsContainer.style.borderRadius = '8px';
      resultsContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      resultsContainer.style.background = isDarkMode ? '#1f2937' : 'white';
      resultsContainer.style.border = `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`;
      resultsContainer.style.maxHeight = '300px';
      resultsContainer.style.overflowY = 'auto';
      resultsContainer.style.transition = 'all 0.3s ease';

      const resultItems = resultsContainer.querySelectorAll('a');
      resultItems.forEach(item => {
        item.style.padding = '10px 14px';
        item.style.borderBottom = `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`;
        item.style.color = isDarkMode ? '#ffffff' : '#1f2937';
        item.style.transition = 'all 0.2s ease';
        item.style.display = 'block';
        item.style.textDecoration = 'none';

        item.addEventListener('mouseover', () => {
          item.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
        });

        item.addEventListener('mouseout', () => {
          item.style.backgroundColor = 'transparent';
        });
      });
    }
  };

  useEffect(() => {
    if (map._geocoderControl) return;

    const geocoder = L.Control.Geocoder.nominatim();
    const control = L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder,
      placeholder: 'Search for a location...',
      position: 'topleft',
      collapsed: false,
      expand: 'click',
      showResultIcons: true,
      suggestMinLength: 3,
      suggestTimeout: 250,
    });

    control.on('markgeocode', function (e) {
      const latlng = e.geocode.center;
      map.setView(latlng, 13);
      const marker = new L.Marker(latlng, { icon: customIcon })
        .addTo(map)
        .bindPopup(e.geocode.name)
        .openPopup();
    });

    control.addTo(map);
    map._geocoderControl = control;

    setTimeout(applyGeocoderStyles, 300);

    return () => {
      if (map._geocoderControl) {
        map.removeControl(map._geocoderControl);
        map._geocoderControl = null;
      }
    };
  }, [map]);

  useEffect(() => {
    setTimeout(applyGeocoderStyles, 300);
  }, [isDarkMode]);

  return null;
};

const CustomZoomControl = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const zoomContainer = document.querySelector('.leaflet-control-zoom');
    if (zoomContainer) {
      zoomContainer.style.borderRadius = '12px';
      zoomContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      zoomContainer.style.background = isDarkMode ? '#1f2937' : 'white';
      zoomContainer.style.border = `1px solid ${isDarkMode ? '#374151' : '#e2e8f0'}`;
      zoomContainer.style.padding = '4px';

      const zoomButtons = zoomContainer.querySelectorAll('a');
      zoomButtons.forEach(button => {
        button.style.borderRadius = '8px';
        button.style.margin = '2px';
        button.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
        button.style.border = 'none';
        button.style.boxShadow = 'none';
        button.style.transition = 'all 0.2s ease';
        button.style.color = isDarkMode ? '#f3f4f6' : '#1f2937';

        button.addEventListener('mouseover', () => {
          button.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
        });

        button.addEventListener('mouseout', () => {
          button.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
        });
      });
    }
  }, [isDarkMode]);

  return <ZoomControl position="topleft" />;
};

const MapPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { lat, lng, countryName } = useParams();
  const [center, setCenter] = useState([6.914245, 79.973918]);
  const [zoom, setZoom] = useState(17);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (lat && lng) {
      setCenter([parseFloat(lat), parseFloat(lng)]);
      setZoom(5);
    }
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [lat, lng]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${isDarkMode 
          ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800' 
          : 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600'
        } text-white p-6 shadow-lg rounded-t-2xl`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-white/90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">World Map</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-white/80'}`}>
                  Search and explore locations around the world
                </p>
              </div>
            </div>
            {countryName && (
              <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/20'}`}>
                <p className="text-sm font-medium">
                  Selected: {countryName}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 relative py-4"
        >
          <MapContainer 
            center={center}
            zoom={zoom}
            className="w-full h-[calc(100vh-140px)]"
            zoomControl={false}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <GeocoderControl />
            <CustomZoomControl />
            {lat && lng && (
              <Marker position={[parseFloat(lat), parseFloat(lng)]} icon={customIcon}>
                <Popup className="font-medium">
                  <div className="p-3">
                    <h3 className="font-bold text-blue-600 text-lg">{countryName || 'Selected Location'}</h3>
                    <p className="text-gray-600 mt-1">Latitude: {lat}, Longitude: {lng}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Click to view location</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Use the search bar to find locations</span>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default MapPage;
