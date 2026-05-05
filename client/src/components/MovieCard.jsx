import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './MovieCard.module.css';

function MovieCard({ movie, onAddToList, onDelete, showActions = false, userRating, review }) {
  const { isAuthenticated } = useAuth();

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div className={styles.card}>
      <Link to={`/movie/${movie.imdbId}`} className={styles.posterWrap}>
        <img
          src={movie.poster}
          alt={movie.title}
          className={styles.poster}
          onError={handleImageError}
        />
        <div className={styles.posterFallback} style={{ display: 'none' }}>
          {movie.title}
        </div>
        {movie.imdbRating && (
          <span className={styles.rating}>★ {movie.imdbRating}</span>
        )}
      </Link>

      <div className={styles.info}>
        <Link to={`/movie/${movie.imdbId}`} className={styles.title}>
          {movie.title}
        </Link>
        <div className={styles.meta}>
          <span>{movie.year}</span>
        </div>
        {movie.genre && (
          <span className={styles.genre}>{movie.genre.split(',')[0].trim()}</span>
        )}
        {userRating && (
          <span className={styles.userRating}>Your rating: {userRating}/10</span>
        )}
        {review && (
          <span className={styles.reviewExcerpt}>"{review}"</span>
        )}
      </div>

      {showActions && isAuthenticated && onAddToList && (
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => onAddToList(movie.imdbId, 'watchlist')}>
            ＋ Watchlist
          </button>
          <button className={styles.actionBtn} onClick={() => onAddToList(movie.imdbId, 'watched')}>
            ✓ Watched
          </button>
          <button className={styles.actionBtn} onClick={() => onAddToList(movie.imdbId, 'favorites')}>
            ♥ Favorites
          </button>
        </div>
      )}

      {showActions && isAuthenticated && onDelete && (
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => onAddToList && onAddToList(movie.imdbId, 'watchlist')}>
            → Watchlist
          </button>
          <button className={styles.actionBtn} onClick={() => onAddToList && onAddToList(movie.imdbId, 'watched')}>
            → Watched
          </button>
          <button className={styles.actionBtn} onClick={() => onAddToList && onAddToList(movie.imdbId, 'favorites')}>
            → Favorites
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={onDelete}>
            ✕ Remove
          </button>
        </div>
      )}

      {showActions && !isAuthenticated && (
        <div className={styles.tooltip}>Sign in to add to your lists</div>
      )}
    </div>
  );
}

export default MovieCard;
