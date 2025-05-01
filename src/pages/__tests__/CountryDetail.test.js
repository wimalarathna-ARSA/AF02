import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import CountryDetail from '../CountryDetail';
import { useAuth } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('CountryDetail Component', () => {
  const mockNavigate = jest.fn();
  const mockToggleFavorite = jest.fn();
  const mockIsFavorite = jest.fn();

  const mockCountryData = {
    name: {
      common: 'Canada',
      official: 'Canada',
      nativeName: { eng: { official: 'Canada', common: 'Canada' } }
    },
    flags: { png: 'https://flagcdn.com/w320/ca.png', svg: 'https://flagcdn.com/ca.svg' },
    capital: ['Ottawa'],
    region: 'Americas',
    subregion: 'North America',
    population: 38005238,
    languages: { eng: 'English', fra: 'French' },
    currencies: { CAD: { name: 'Canadian dollar', symbol: '$' } },
    borders: ['USA'],
    cca3: 'CAN',
    coatOfArms: { png: 'https://mainfacts.com/media/images/coats_of_arms/ca.png' },
    maps: {
      googleMaps: 'https://goo.gl/maps/jmEVLugreeqiZXxbA',
      openStreetMaps: 'https://www.openstreetmap.org/relation/1428125'
    },
    car: { signs: ['CDN'], side: 'right' },
    postalCode: { format: 'A#A #A#', regex: '' },
    drivingSide: 'right',
    unMember: true,
    independent: true,
    area: 9984670,
    landlocked: false,
    gini: { '2017': 33.3 },
    startOfWeek: 'sunday'
  };

  const renderWithProviders = () => {
    return render(
      <MemoryRouter initialEntries={['/country/CAN']}>
        <ThemeProvider>
          <Routes>
            <Route path="/country/:countryCode" element={<CountryDetail />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ countryCode: 'CAN' });
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      isAuthenticated: true,
      toggleFavorite: mockToggleFavorite,
      isFavorite: mockIsFavorite,
    });

    global.fetch = jest.fn((url) => {
      if (url.includes('/alpha/CAN')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCountryData),
        });
      } else if (url.includes('/alpha?codes=USA')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              name: { common: 'United States' },
              cca3: 'USA',
              flags: { png: 'https://flagcdn.com/w320/us.png' }
            }
          ]),
        });
      }
      return Promise.reject(new Error('Unknown fetch URL'));
    });
    
  });

  it('renders loading state initially', () => {
    renderWithProviders();
    expect(screen.getByText('Loading country details...')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Error Loading Country')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('renders country details when fetch succeeds', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByText('Canada').length).toBeGreaterThan(0);
      expect(screen.getByText(/Ottawa/i)).toBeInTheDocument();
      expect(screen.getByText(/38,005,238/i)).toBeInTheDocument();
      expect(screen.getByText(/English/i)).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
  });

  it('handles favorite button click', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByText('Canada').length).toBeGreaterThan(0);
    });
    

    const favoriteButton = screen.getByRole('button', { name: /favorite/i });
    fireEvent.click(favoriteButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith('CAN');
  });

  it('redirects to login when not authenticated', () => {
    useAuth.mockReturnValueOnce({
      isAuthenticated: false,
      toggleFavorite: mockToggleFavorite,
      isFavorite: mockIsFavorite,
    });

    renderWithProviders();

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });


  it('displays favorite icon correctly when country is favorited', async () => {
    mockIsFavorite.mockReturnValue(true);

    renderWithProviders();

    await waitFor(() => {
      const favoriteButton = screen.getByRole('button', { name: /favorite/i });
      expect(favoriteButton.querySelector('svg')).toHaveClass('fill-rose-500');
    });
  });
});
