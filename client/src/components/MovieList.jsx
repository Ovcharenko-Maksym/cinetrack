import MovieCard from './MovieCard';
import styles from './MovieList.module.css';

function MovieList({
  movies,
  onAddToList,
  onMove,
  onDelete,
  onEdit,
  showActions = false,
  currentStatus,
  emptyMessage = 'No movies found',
}) {
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
        const isListItem = !!item.id && !!item.status;

        return (
          <MovieCard
            key={(movie.imdbId || item.id) + (item.id || '')}
            movie={movie}
            onAddToList={!isListItem ? onAddToList : undefined}
            onMove={isListItem && onMove ? (status) => onMove(item.id, status) : undefined}
            onDelete={isListItem && onDelete ? () => onDelete(item.id) : undefined}
            onEdit={isListItem && onEdit ? () => onEdit(item) : undefined}
            showActions={showActions}
            currentStatus={isListItem ? (currentStatus || item.status) : undefined}
            userRating={item.userRating}
            review={item.review}
          />
        );
      })}
    </div>
  );
}

export default MovieList;
