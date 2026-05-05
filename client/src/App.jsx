import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import WatchlistPage from './pages/WatchlistPage';
import WatchedPage from './pages/WatchedPage';
import FavoritesPage from './pages/FavoritesPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:imdbId" element={<MoviePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/watchlist" element={<PrivateRoute><WatchlistPage /></PrivateRoute>} />
          <Route path="/watched" element={<PrivateRoute><WatchedPage /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
