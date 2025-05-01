import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const loadUserData = (email) => {
    try {
      const storedFavorites = localStorage.getItem(`favorites_${email}`);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(new Set(parsedFavorites));
      } else {
        setFavorites(new Set());
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites(new Set());
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        loadUserData(parsedUser.email);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setUser(null);
      setIsAuthenticated(false);
      setFavorites(new Set());
    }
  }, []);

  const login = (userData) => {
    const userWithId = {
      ...userData,
      id: Date.now().toString(),
      username: userData.email.split('@')[0]
    };
    setUser(userWithId);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithId));
    loadUserData(userWithId.email);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setFavorites(new Set());
    localStorage.removeItem('user');
  };

  const toggleFavorite = (countryCode) => {
    if (!user) return;

    const newFavorites = new Set(favorites);
    if (newFavorites.has(countryCode)) {
      newFavorites.delete(countryCode);
    } else {
      newFavorites.add(countryCode);
    }
    setFavorites(newFavorites);
    const favoritesArray = Array.from(newFavorites).sort();
    localStorage.setItem(`favorites_${user.email}`, JSON.stringify(favoritesArray));
  };

  const isFavorite = (countryCode) => favorites.has(countryCode);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};