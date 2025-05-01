import React from 'react';
import { render, screen } from '@testing-library/react';
jest.mock('react-globe.gl', () => () => <div data-testid="globe">MockGlobe</div>);

import App from './App';

jest.mock('./components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('./pages/Home', () => () => <div data-testid="home">Home</div>);
jest.mock('./pages/CountryDetail', () => () => <div data-testid="country-detail">CountryDetail</div>);
jest.mock('./pages/CountryComparison', () => () => <div data-testid="comparison">CountryComparison</div>);
jest.mock('./pages/MapPage', () => () => <div data-testid="map">MapPage</div>);
jest.mock('./components/Login', () => () => <div data-testid="login">Login</div>);
jest.mock('./components/SignUp', () => () => <div data-testid="signup">SignUp</div>);
jest.mock('./components/main', () => () => <div data-testid="main">Main</div>);


jest.mock('./context/AuthContext', () => ({
  ...jest.requireActual('./context/AuthContext'),
  useAuth: jest.fn(),
}));

jest.mock('./context/ThemeContext', () => ({
  __esModule: true,
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>,
  useTheme: () => ({ isDarkMode: false }),
}));

describe('App Component Integration Tests', () => {
  const mockUseAuth = jest.requireMock('./context/AuthContext').useAuth;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      login: jest.fn(),
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Basic Integration', () => {
    it('renders without crashing', () => {
      render(<App />);
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('renders context providers', () => {
      render(<App />);
      expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    });
  });

  describe('Authentication Flow Integration', () => {
    it('shows protected content when authenticated', () => {
      mockUseAuth.mockReturnValue({ isAuthenticated: true });
      render(<App />);
      expect(screen.getByTestId('home')).toBeInTheDocument();
      expect(screen.queryByTestId('login')).not.toBeInTheDocument();
    });

    it('redirects to login when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      });
      render(<App />);
      expect(screen.getByTestId('main')).toBeInTheDocument();
      expect(screen.queryByTestId('home')).not.toBeInTheDocument();
    });
  });

  describe('Other Integration', () => {
    it('renders login page when accessing /login', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      });
      render(<App />);
      expect(screen.getByTestId('main')).toBeInTheDocument();
    });
    
    it('shows signup page when accessing /signup', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      });
      render(<App />);
      expect(screen.getByTestId('main')).toBeInTheDocument();
    });

  });
});
