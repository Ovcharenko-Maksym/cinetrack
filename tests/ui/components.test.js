/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

let mockIsAuthenticated = false;
let mockUser = null;

jest.mock('../../client/src/context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    token: mockIsAuthenticated ? 'fake-token' : null,
    isAuthenticated: mockIsAuthenticated,
    login: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }) => children,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../../client/src/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  setAuthToken: jest.fn(),
}));

import LoginPage from '../../client/src/pages/LoginPage';
import RegisterPage from '../../client/src/pages/RegisterPage';
import Navbar from '../../client/src/components/Navbar';

function renderWithRouter(component) {
  return render(<MemoryRouter>{component}</MemoryRouter>);
}

describe('UI Components', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('LoginPage — renders email/password fields and submit button', () => {
    mockIsAuthenticated = false;
    renderWithRouter(<LoginPage />);

    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your password')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText('Create one').closest('a')).toHaveAttribute('href', '/register');
  });

  test('RegisterPage — renders all fields and submit button', () => {
    mockIsAuthenticated = false;
    renderWithRouter(<RegisterPage />);

    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min. 6 characters')).toHaveAttribute('type', 'password');
    expect(screen.getByPlaceholderText('Repeat your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('Navbar — shows auth links for guests, nav links for logged-in users', () => {
    mockIsAuthenticated = false;
    mockUser = null;
    const { unmount } = renderWithRouter(<Navbar />);

    expect(screen.getAllByText('Login').length).toBeGreaterThan(0);
    expect(screen.queryByText('Watchlist')).not.toBeInTheDocument();
    unmount();

    mockIsAuthenticated = true;
    mockUser = { name: 'John Doe' };
    renderWithRouter(<Navbar />);

    expect(screen.getByText('Watchlist')).toBeInTheDocument();
    expect(screen.getByText('Watched')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getAllByText('JD').length).toBeGreaterThan(0);
  });
});
