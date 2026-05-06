import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './MovieCard.module.css';

const STATUS_LABELS = {
  watchlist: { icon: '📋', label: 'Watchlist' },
  watched: { icon: '✓', label: 'Watched' },
  favorites: { icon: '♥', label: 'Favorites' },
};

function MovieCard({
  movie,
  onAddToList,
  onMove,
  onDelete,
  onEdit,
  showActions = false,
  currentStatus,
  userRating,
  review,
  isCustom = false,
}) {
  const { isAuthenticated } = useAuth();
  const isCustomMovie = isCustom || movie.imdbId?.startsWith('custom-');

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const movieLink = isCustomMovie ? null : `/movie/${movie.imdbId}`;

  const posterContent = (
    <>
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
      {isCustomMovie && <span className={styles.customBadge}>My movie</span>}
    </>
  );

  return (
    <div className={styles.card}>
      {movieLink ? (
        <Link to={movieLink} className={styles.posterWrap}>
          {posterContent}
        </Link>
      ) : (
        <div className={styles.posterWrap}>{posterContent}</div>
      )}

      <div className={styles.info}>
        {movieLink ? (
          <Link to={movieLink} className={styles.title}>
            {movie.title}
          </Link>
        ) : (
          <span className={styles.title}>{movie.title}</span>
        )}
        <div className={styles.meta}>
          <span>{movie.year}</span>
          {movie.director && <span>{movie.director}</span>}
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

      {showActions && isAuthenticated && onAddToList && !onMove && (
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.btnWatchlist}`}
            onClick={() => onAddToList(movie.imdbId, 'watchlist')}
          >
            📋 Watchlist
          </button>
          <button
            className={`${styles.actionBtn} ${styles.btnWatched}`}
            onClick={() => onAddToList(movie.imdbId, 'watched')}
          >
            ✓ Watched
          </button>
          <button
            className={`${styles.actionBtn} ${styles.btnFavorites}`}
            onClick={() => onAddToList(movie.imdbId, 'favorites')}
          >
            ♥ Favorites
          </button>
        </div>
      )}

      {showActions && isAuthenticated && onMove && (
        <div className={styles.actions}>
          {onEdit && (
            <button
              className={`${styles.actionBtn} ${styles.btnEdit}`}
              onClick={onEdit}
            >
              ✎ Edit
            </button>
          )}
          {Object.entries(STATUS_LABELS)
            .filter(([status]) => status !== currentStatus)
            .map(([status, { icon, label }]) => (
              <button
                key={status}
                className={`${styles.actionBtn} ${styles[`btn${label}`]}`}
                onClick={() => onMove(status)}
              >
                {icon} {label}
              </button>
            ))}
          {onDelete && (
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={onDelete}
            >
              ✕ Remove
            </button>
          )}
        </div>
      )}

      {showActions && !isAuthenticated && (
        <div className={styles.tooltip}>Sign in to add to your lists</div>
      )}
    </div>
  );
}

export default MovieCard;
