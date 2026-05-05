import { useState, useEffect } from 'react';
import styles from './GenreChart.module.css';

function GenreChart({ genres = [] }) {
  const [animated, setAnimated] = useState(false);
  const maxCount = Math.max(...genres.map(g => g.count), 1);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.chart}>
      {genres.map(({ genre, count }) => (
        <div key={genre} className={styles.row}>
          <span className={styles.label}>{genre}</span>
          <div className={styles.barWrapper}>
            <div
              className={styles.bar}
              style={{ width: animated ? `${(count / maxCount) * 100}%` : '0%' }}
            />
          </div>
          <span className={styles.count}>{count}</span>
        </div>
      ))}
    </div>
  );
}

export default GenreChart;
