import styles from './FilterBar.module.css';

function FilterBar({ sortValue, onSortChange }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Sort by:</span>
      <select
        className={styles.select}
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
        <option value="year-newest">Year (Newest)</option>
        <option value="year-oldest">Year (Oldest)</option>
        <option value="rating-desc">Rating (High-Low)</option>
      </select>
    </div>
  );
}

export default FilterBar;
