import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const linkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          🎬 CineTrack
        </Link>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>

        <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
          <NavLink to="/" className={linkClass} end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/watchlist" className={linkClass} onClick={() => setMenuOpen(false)}>
                Watchlist
              </NavLink>
              <NavLink to="/watched" className={linkClass} onClick={() => setMenuOpen(false)}>
                Watched
              </NavLink>
              <NavLink to="/favorites" className={linkClass} onClick={() => setMenuOpen(false)}>
                Favorites
              </NavLink>
              <NavLink to="/my-movies" className={linkClass} onClick={() => setMenuOpen(false)}>
                My Movies
              </NavLink>
              <NavLink to="/stats" className={linkClass} onClick={() => setMenuOpen(false)}>
                Stats
              </NavLink>
            </>
          )}
          <div className={styles.mobileActions}>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className={styles.avatar} onClick={() => setMenuOpen(false)}>
                  {getInitials(user?.name)}
                </Link>
                <span className={styles.userName}>{user?.name}</span>
                <button
                  className={styles.btnLogout}
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${styles.btn} ${styles.btnLogin}`} onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className={`${styles.btn} ${styles.btnRegister}`} onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={styles.avatar}>
                {getInitials(user?.name)}
              </Link>
              <span className={styles.userName}>{user?.name}</span>
              <button className={styles.btnLogout} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`${styles.btn} ${styles.btnLogin}`}>
                Login
              </Link>
              <Link to="/register" className={`${styles.btn} ${styles.btnRegister}`}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
