import MovieCard from './MovieCard';
import styles from './MovieList.module.css';

function MovieList({ movies, onAddToList, onDelete, showActions = false, emptyMessage = 'No movies found' }) {
  if (!movies || movies.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🎬</div>
        <p className={styles.emptyText}>{emptyMessage}</p>
        <p className={styles.emptyHint}>Start exploring to add movies here</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {movies.map((item) => {
        const movie = item.movie || item;
        return (
          <MovieCard
            key={movie.imdbId + (item.id || '')}
            movie={movie}
            onAddToList={onAddToList}
            onDelete={onDelete ? () => onDelete(item.id) : null}
            showActions={showActions}
            userRating={item.userRating}
            review={item.review}
          />
        );
      })}
    </div>
  );
}

export default MovieList;
