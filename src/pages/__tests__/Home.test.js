import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import { useAuth } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

global.fetch = jest.fn();

describe('Home', () => {
  const mockCountries = [
    {
      cca3: 'USA',
      name: { common: 'United States' },
      flags: { png: 'https://flagcdn.com/us.png', svg: 'https://flagcdn.com/us.svg' },
      region: 'Americas',
      population: 331002651,
      languages: { eng: 'English' },
    },
    {
      cca3: 'CAN',
      name: { common: 'Canada' },
      flags: { png: 'https://flagcdn.com/ca.png', svg: 'https://flagcdn.com/ca.svg' },
      region: 'Americas',
      population: 38005238,
      languages: { eng: 'English', fra: 'French' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      favorites: new Set(),
      toggleFavorite: jest.fn(),
      isFavorite: jest.fn().mockReturnValue(false),
    }));

    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCountries),
      })
    );
  });

  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          {component}
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  it('renders loading state initially', async () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText(/Loading countries.../i)).toBeInTheDocument();
  });

  it('displays countries when fetch succeeds', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading countries.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('filters countries by search input', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading countries.../i)).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search for a country.../i);
    fireEvent.change(searchInput, { target: { value: 'United' } });

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.queryByText('Canada')).not.toBeInTheDocument();
  });
  it('filters countries by region', async () => {
  renderWithProviders(<Home />);

  await waitFor(() => {
    expect(screen.queryByText(/Loading countries.../i)).not.toBeInTheDocument();
  });

  // Clear any existing search term first
  const searchInput = screen.getByPlaceholderText(/Search for a country.../i);
  fireEvent.change(searchInput, { target: { value: '' } });

  const regionSelect = screen.getByLabelText(/Region/i);
  fireEvent.change(regionSelect, { target: { value: 'Americas' } });

  await waitFor(() => {
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });
});

it('filters countries by language', async () => {
  renderWithProviders(<Home />);

  await waitFor(() => {
    expect(screen.queryByText(/Loading countries.../i)).not.toBeInTheDocument();
  });

  // Clear any existing search term first
  const searchInput = screen.getByPlaceholderText(/Search for a country.../i);
  fireEvent.change(searchInput, { target: { value: '' } });

  const languageSelect = screen.getByLabelText(/Language/i);
  fireEvent.change(languageSelect, { target: { value: 'English' } });

  await waitFor(() => {
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });
});
  it('handles favorite button click', async () => {
    const toggleFavorite = jest.fn();
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      favorites: new Set(),
      toggleFavorite,
      isFavorite: jest.fn().mockReturnValue(false),
    }));

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading countries.../i)).not.toBeInTheDocument();
    });

    const usaCard = screen.getByText('United States').closest('a');
    const favoriteButton = within(usaCard).getByTitle(/Add to favorites/i);
    fireEvent.click(favoriteButton);

    expect(toggleFavorite).toHaveBeenCalledWith('USA');
  });

  it('displays error message when fetch fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading countries.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error fetching countries: Failed to fetch/i)).toBeInTheDocument();
  });

  it('updates favorite button state when country is favorited', async () => {
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      favorites: new Set(['USA']),
      toggleFavorite: jest.fn(),
      isFavorite: jest.fn().mockImplementation((code) => code === 'USA'),
    }));

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading countries.../i)).not.toBeInTheDocument();
    });

    const favoriteButton = screen.getByTitle(/Remove from favorites/i);
    expect(favoriteButton).toBeInTheDocument();
  });

  it('shows favorites only when filter is active', async () => {
    useAuth.mockImplementation(() => ({
      isAuthenticated: true,
      favorites: new Set(['USA']),
      toggleFavorite: jest.fn(),
      isFavorite: jest.fn().mockImplementation((code) => code === 'USA'),
    }));

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading countries.../i)).not.toBeInTheDocument();
    });

    const showFavoritesButton = screen.getByRole('button', { name: /Show Favorites/i });
    fireEvent.click(showFavoritesButton);

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.queryByText('Canada')).not.toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading countries.../i)).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search for a country.../i);
    const regionSelect = screen.getByLabelText(/Region/i);
    const languageSelect = screen.getByLabelText(/Language/i);

    fireEvent.change(searchInput, { target: { value: 'United' } });
    fireEvent.change(regionSelect, { target: { value: 'Americas' } });
    fireEvent.change(languageSelect, { target: { value: 'English' } });

    const clearButton = screen.getByRole('button', { name: /Clear all filters/i });
    fireEvent.click(clearButton);

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });
}); 