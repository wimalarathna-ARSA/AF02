import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // import ThemeProvider
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CountryDetail from './pages/CountryDetail';
import CountryComparison from './pages/CountryComparison';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Main from './components/main';
import MapPage from './pages/MapPage';
import CultureExplorer from './pages/CultureExplorer';
import CultureHub from './pages/CultureHub';
import ForgotPassword from './components/ForgotPassword';
import './App.css';
import 'leaflet/dist/leaflet.css';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/main" />;
};

const AppContent = () => {
  return (
    
    <>
    <div>
      <Navbar />
      <main className="pt-20">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/country/:countryCode"
          element={
            <ProtectedRoute>
              <CountryDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compare"
          element={
            <ProtectedRoute>
              <CountryComparison />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/map/:lat/:lng/:countryName"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="/main" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />  
        <Route path="/map" element={<MapPage/>} />
        <Route path="/culture" element={<CultureHub />} />
        <Route path="/culture/:countryCode" element={<CultureExplorer />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
            
      </Routes>
      <Footer/>
      </main>
     
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
