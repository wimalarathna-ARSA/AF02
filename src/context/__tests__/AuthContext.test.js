import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock localStorage
const mockLocalStorage = {
  store: {},
  getItem: jest.fn((key) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key, value) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: jest.fn((key) => {
    delete mockLocalStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  })
};

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
});

const TestComponent = () => {
  const { user, isAuthenticated, login, logout, toggleFavorite, isFavorite } = useAuth();

  return (
    <div>
      <div data-testid="status">
        {isAuthenticated ? `Logged in as ${user?.email}` : 'Logged out'}
      </div>
      <button onClick={() => login({ email: 'test@example.com' })}>
        Login
      </button>
      <button onClick={logout}>
        Logout
      </button>
      <button onClick={() => toggleFavorite('US')}>
        Toggle US Favorite
      </button>
      <div data-testid="favorite-status">
        {isFavorite('US') ? 'US is favorite' : 'US is not favorite'}
      </div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    mockLocalStorage.getItem.mockImplementation((key) => mockLocalStorage.store[key] || null);
  });

  it('should handle login and logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('Logged out');

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('status')).toHaveTextContent('Logged in as test@example.com');
    
    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('status')).toHaveTextContent('Logged out');
  });

  it('should handle favorites', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    await act(async () => {
      screen.getByText('Toggle US Favorite').click();
    });

    expect(screen.getByTestId('favorite-status')).toHaveTextContent('US is favorite');

    await act(async () => {
      screen.getByText('Toggle US Favorite').click();
    });

    expect(screen.getByTestId('favorite-status')).toHaveTextContent('US is not favorite');
  });

  it('should restore state from localStorage', () => {
    const userData = {
      email: 'saved@example.com',
      id: '123',
      username: 'saved'
    };
    
    // Set up mock responses
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(userData);
      if (key === `favorites_${userData.email}`) return JSON.stringify(['US']);
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('Logged in as saved@example.com');
    expect(screen.getByTestId('favorite-status')).toHaveTextContent('US is favorite');
  });

  it('should handle invalid localStorage data', () => {
    mockLocalStorage.getItem.mockImplementation(() => 'invalid-json');
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('Logged out');
  });
});