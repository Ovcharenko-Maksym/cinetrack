import { useState, useEffect } from 'react';
import { getUserMovies, deleteUserMovie, moveUserMovie, updateUserMovie } from '../api';
import { useToast } from '../components/Toast';
import FilterBar from '../components/FilterBar';
import MovieList from '../components/MovieList';
import MovieForm from '../components/MovieForm';
import styles from './ListPage.module.css';

function WatchedPage() {
  const [movies, setMovies] = useState([]);
  const [sort, setSort] = useState('title-asc');
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    getUserMovies('watched', sort).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [sort]);

  const handleDelete = async (id) => {
    try {
      await deleteUserMovie(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      toast.success('Removed from watched');
    } catch {
      toast.error('Failed to remove movie');
    }
  };

  const handleMove = async (id, status) => {
    try {
      await moveUserMovie(id, status);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      const labels = { watchlist: 'Watchlist', favorites: 'Favorites' };
      toast.success(`Moved to ${labels[status]}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to move movie');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleEditSubmit = async ({ userRating, review }) => {
    try {
      await updateUserMovie(editingItem.id, { userRating, review });
      setMovies((prev) =>
        prev.map((m) =>
          m.id === editingItem.id ? { ...m, userRating, review } : m
        )
      );
      setEditingItem(null);
      toast.success('Rating updated');
    } catch {
      toast.error('Failed to update rating');
    }
  };

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Watched Movies</h1>
      <FilterBar sortValue={sort} onSortChange={setSort} />

      {editingItem && (
        <div className={styles.editOverlay}>
          <div className={styles.editModal}>
            <h3 className={styles.editTitle}>
              Edit: {editingItem.movie?.title}
            </h3>
            <MovieForm
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingItem(null)}
              initialRating={editingItem.userRating || 0}
              initialReview={editingItem.review || ''}
            />
          </div>
        </div>
      )}

      <MovieList
        movies={movies}
        onMove={handleMove}
        onDelete={handleDelete}
        onEdit={handleEdit}
        showActions={true}
        currentStatus="watched"
        emptyMessage="You haven't watched any movies yet. Start exploring!"
      />
    </div>
  );
}

export default WatchedPage;
