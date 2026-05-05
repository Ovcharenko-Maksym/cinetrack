import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMovieDetails, addUserMovie, updateUserMovie } from '../api';
import { formatRuntime } from '../utils/format';
import MovieForm from '../components/MovieForm';
import styles from './MoviePage.module.css';

function MoviePage() {
  const { imdbId } = useParams();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMovieDetails(imdbId).then((data) => {
      setMovie(data);
      setLoading(false);
    });
  }, [imdbId]);

  const handleAddToList = async (status) => {
    if (status === 'watched') {
      setShowForm(true);
      return;
    }
    await addUserMovie(imdbId, status);
  };

  const handleFormSubmit = async ({ userRating, review }) => {
    await addUserMovie(imdbId, 'watched');
    setShowForm(false);
  };

  if (loading) {
    return <div className={styles.loading}>Loading movie details...</div>;
  }

  if (!movie) {
    return <div className={styles.notFound}>Movie not found</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <img src={movie.poster} alt={movie.title} className={styles.poster} />

        <div className={styles.details}>
          <h1 className={styles.title}>{movie.title}</h1>

          <div className={styles.meta}>
            <span>{movie.year}</span>
            <span>{formatRuntime(movie.runtime)}</span>
            <span>{movie.director}</span>
          </div>

          {movie.imdbRating && (
            <div className={styles.rating}>
              ★ {movie.imdbRating}/10
            </div>
          )}

          {movie.genre && (
            <div className={styles.genres}>
              {movie.genre.split(',').map((g) => (
                <span key={g.trim()} className={styles.genreBadge}>{g.trim()}</span>
              ))}
            </div>
          )}

          <p className={styles.plot}>{movie.plot}</p>

          {isAuthenticated && (
            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={() => handleAddToList('watchlist')}>
                ＋ Watchlist
              </button>
              <button className={styles.actionBtn} onClick={() => handleAddToList('watched')}>
                ✓ Watched
              </button>
              <button className={styles.actionBtn} onClick={() => handleAddToList('favorites')}>
                ♥ Favorites
              </button>
            </div>
          )}

          {showForm && (
            <MovieForm
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
