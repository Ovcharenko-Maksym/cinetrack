import { useState, useEffect } from 'react';
import styles from './RatingHistogram.module.css';

function RatingHistogram({ distribution = {} }) {
  const [animated, setAnimated] = useState(false);
  const maxCount = Math.max(...Object.values(distribution), 1);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const ratings = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className={styles.chart}>
      {ratings.map((rating) => {
        const count = distribution[String(rating)] || 0;
        const height = animated ? `${(count / maxCount) * 100}%` : '0%';
        const isHighlight = rating >= 8;

        return (
          <div key={rating} className={styles.column}>
            <span className={styles.count}>{count}</span>
            <div
              className={`${styles.bar} ${isHighlight ? styles.barHighlight : ''}`}
              style={{ height }}
            />
            <span className={styles.label}>{rating}</span>
          </div>
        );
      })}
    </div>
  );
}

export default RatingHistogram;
