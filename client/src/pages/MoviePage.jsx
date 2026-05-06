import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMovieDetails, addUserMovie, updateUserMovie } from '../api';
import { useToast } from '../components/Toast';
import { formatRuntime } from '../utils/format';
import MovieForm from '../components/MovieForm';
import styles from './MoviePage.module.css';

function MoviePage() {
  const { imdbId } = useParams();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [addedTo, setAddedTo] = useState(new Set());
  const toast = useToast();

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
    try {
      await addUserMovie(imdbId, status);
      setAddedTo((prev) => new Set(prev).add(status));
      const labels = { watchlist: 'Watchlist', favorites: 'Favorites' };
      toast.success(`Added to ${labels[status]}`);
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg === 'Movie is already in this list') {
        toast.info('Movie is already in this list');
      } else {
        toast.error(msg || 'Failed to add movie');
      }
    }
  };

  const handleFormSubmit = async ({ userRating, review }) => {
    try {
      const created = await addUserMovie(imdbId, 'watched');
      if (userRating || review) {
        await updateUserMovie(created.id, { userRating, review });
      }
      setAddedTo((prev) => new Set(prev).add('watched'));
      setShowForm(false);
      toast.success('Marked as watched');
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg === 'Movie is already in this list') {
        toast.info('Movie is already in watched list');
      } else {
        toast.error(msg || 'Failed to mark as watched');
      }
      setShowForm(false);
    }
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
              <button
                className={`${styles.actionBtn} ${addedTo.has('watchlist') ? styles.actionBtnDone : ''}`}
                onClick={() => handleAddToList('watchlist')}
                disabled={addedTo.has('watchlist')}
              >
                {addedTo.has('watchlist') ? '✓ In Watchlist' : '📋 Watchlist'}
              </button>
              <button
                className={`${styles.actionBtn} ${addedTo.has('watched') ? styles.actionBtnDone : ''}`}
                onClick={() => handleAddToList('watched')}
                disabled={addedTo.has('watched')}
              >
                {addedTo.has('watched') ? '✓ Watched' : '✓ Watched'}
              </button>
              <button
                className={`${styles.actionBtn} ${addedTo.has('favorites') ? styles.actionBtnDone : ''}`}
                onClick={() => handleAddToList('favorites')}
                disabled={addedTo.has('favorites')}
              >
                {addedTo.has('favorites') ? '♥ Favorited' : '♥ Favorites'}
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
