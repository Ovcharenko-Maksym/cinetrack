import { useState, useEffect } from 'react';
import { getUserMovies, deleteUserMovie, addUserMovie } from '../api';
import FilterBar from '../components/FilterBar';
import MovieList from '../components/MovieList';
import styles from './ListPage.module.css';

function WatchlistPage() {
  const [movies, setMovies] = useState([]);
  const [sort, setSort] = useState('title-asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserMovies('watchlist', sort).then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, [sort]);

  const handleDelete = async (id) => {
    await deleteUserMovie(id);
    setMovies(movies.filter(m => m.id !== id));
  };

  const handleMoveToList = async (imdbId, status) => {
    await addUserMovie(imdbId, status);
  };

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>My Watchlist</h1>
      <FilterBar sortValue={sort} onSortChange={setSort} />
      <MovieList
        movies={movies}
        onAddToList={handleMoveToList}
        onDelete={handleDelete}
        showActions={true}
        emptyMessage="Your watchlist is empty. Explore movies and add them here!"
      />
    </div>
  );
}

export default WatchlistPage;
