import { useState, useEffect } from 'react';
import { getUserMovies, deleteUserMovie, moveUserMovie } from '../api';
import { useToast } from '../components/Toast';
import FilterBar from '../components/FilterBar';
import MovieList from '../components/MovieList';
import styles from './ListPage.module.css';

function FavoritesPage() {
  const [movies, setMovies] = useState([]);
  const [sort, setSort] = useState('title-asc');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    getUserMovies('favorites', sort).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [sort]);

  const handleDelete = async (id) => {
    try {
      await deleteUserMovie(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove movie');
    }
  };

  const handleMove = async (id, status) => {
    try {
      await moveUserMovie(id, status);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      const labels = { watchlist: 'Watchlist', watched: 'Watched' };
      toast.success(`Moved to ${labels[status]}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to move movie');
    }
  };

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Favorites</h1>
      <FilterBar sortValue={sort} onSortChange={setSort} />
      <MovieList
        movies={movies}
        onMove={handleMove}
        onDelete={handleDelete}
        showActions={true}
        currentStatus="favorites"
        emptyMessage="No favorites yet. Mark movies you love!"
      />
    </div>
  );
}

export default FavoritesPage;
