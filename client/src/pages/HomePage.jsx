import { useState, useEffect } from 'react';
import { searchMovies, searchByDirector, getTopMovies, addUserMovie } from '../api';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import styles from './HomePage.module.css';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('all');
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    getTopMovies().then(setTopMovies);
  }, []);

  const handleSearch = async (searchQuery, mode) => {
    setQuery(searchQuery);
    setSearchMode(mode);
    if (!searchQuery) {
      setMovies([]);
      return;
    }
    setLoading(true);
    try {
      const results = mode === 'director'
        ? await searchByDirector(searchQuery)
        : await searchMovies(searchQuery);
      setMovies(results);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async (imdbId, status) => {
    await addUserMovie(imdbId, status);
  };

  const getResultsTitle = () => {
    if (searchMode === 'director') {
      return `Movies by "${query}"`;
    }
    return 'Search Results';
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Discover Movies</h1>
      <SearchBar onSearch={handleSearch} loading={loading} />

      {query ? (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {getResultsTitle()} {movies.length > 0 && `(${movies.length})`}
          </h2>
          <MovieList
            movies={movies}
            onAddToList={handleAddToList}
            showActions={true}
            emptyMessage={
              searchMode === 'director'
                ? `No movies found for director "${query}"`
                : 'No movies found for your search'
            }
          />
        </div>
      ) : (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top Movies</h2>
          <MovieList
            movies={topMovies}
            onAddToList={handleAddToList}
            showActions={true}
          />
        </div>
      )}
    </div>
  );
}

export default HomePage;
