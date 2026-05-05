import { useState, useEffect } from 'react';
import { getUserMovies, deleteUserMovie, addUserMovie } from '../api';
import FilterBar from '../components/FilterBar';
import MovieList from '../components/MovieList';
import styles from './ListPage.module.css';

function WatchedPage() {
  const [movies, setMovies] = useState([]);
  const [sort, setSort] = useState('title-asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserMovies('watched', sort).then((data) => {
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
      <h1 className={styles.heading}>Watched Movies</h1>
      <FilterBar sortValue={sort} onSortChange={setSort} />
      <MovieList
        movies={movies}
        onAddToList={handleMoveToList}
        onDelete={handleDelete}
        showActions={true}
        emptyMessage="You haven't watched any movies yet. Start exploring!"
      />
    </div>
  );
}

export default WatchedPage;
