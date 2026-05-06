import { useState, useEffect } from 'react';
import {
  searchMovies,
  getTopMovies,
  getCollections,
  getCollection,
  addUserMovie,
} from '../api';
import { useToast } from '../components/Toast';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import styles from './HomePage.module.css';

function HomePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [topMovies, setTopMovies] = useState([]);
  const [collections, setCollections] = useState([]);
  const [openCollection, setOpenCollection] = useState(null);
  const [collectionMovies, setCollectionMovies] = useState([]);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getTopMovies().then(setTopMovies);
    getCollections().then(setCollections);
  }, []);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCollectionClick = async (id) => {
    if (openCollection === id) {
      setOpenCollection(null);
      setCollectionMovies([]);
      return;
    }
    setOpenCollection(id);
    setCollectionLoading(true);
    try {
      const data = await getCollection(id);
      setCollectionMovies(data.movies);
    } catch {
      toast.error('Failed to load collection');
    } finally {
      setCollectionLoading(false);
    }
  };

  const handleAddToList = async (imdbId, status) => {
    try {
      await addUserMovie(imdbId, status);
      const labels = { watchlist: 'Watchlist', watched: 'Watched', favorites: 'Favorites' };
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

  const isSearching = query.length > 0;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Discover Movies</h1>
      <SearchBar onSearch={handleSearch} loading={searchLoading} />

      {isSearching ? (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Search Results {searchResults.length > 0 && `(${searchResults.length})`}
          </h2>
          <MovieList
            movies={searchResults}
            onAddToList={handleAddToList}
            showActions={true}
            emptyMessage="No movies found for your search"
          />
        </div>
      ) : (
        <>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Collections</h2>
            <div className={styles.collectionGrid}>
              {collections.map((col) => (
                <button
                  key={col.id}
                  className={`${styles.collectionCard} ${openCollection === col.id ? styles.collectionCardActive : ''}`}
                  onClick={() => handleCollectionClick(col.id)}
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>

          {openCollection && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {collections.find((c) => c.id === openCollection)?.title}
              </h2>
              {collectionLoading ? (
                <div className={styles.loadingText}>Loading...</div>
              ) : (
                <MovieList
                  movies={collectionMovies}
                  onAddToList={handleAddToList}
                  showActions={true}
                  emptyMessage="No movies in this collection"
                />
              )}
            </div>
          )}

          {topMovies.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Top in Community</h2>
              <MovieList
                movies={topMovies}
                onAddToList={handleAddToList}
                showActions={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
