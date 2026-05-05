import { useState, useEffect } from 'react';
import { getUserStats, getUserActivity } from '../api';
import Heatmap from '../components/Heatmap';
import GenreChart from '../components/GenreChart';
import RatingHistogram from '../components/RatingHistogram';
import styles from './StatsPage.module.css';

function StatsPage() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUserStats(), getUserActivity(2026)]).then(([statsData, activityData]) => {
      setStats(statsData);
      setActivity(activityData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading stats...</div>;
  }

  const totalHours = Math.round(stats.totalMinutes / 60);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Your Stats</h1>

      <div className={styles.summaryRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalWatched}</div>
          <div className={styles.statLabel}>Movies Watched</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalHours}h</div>
          <div className={styles.statLabel}>Total Watch Time</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.avgRating}</div>
          <div className={styles.statLabel}>Average Rating</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.reviewsCount}</div>
          <div className={styles.statLabel}>Reviews Written</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Activity Heatmap</h2>
        <Heatmap data={activity} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Top Genres</h2>
        <GenreChart genres={stats.topGenres} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Rating Distribution</h2>
        <RatingHistogram distribution={stats.ratingDistribution} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Top Directors</h2>
        <div className={styles.directors}>
          {stats.topDirectors.map(({ director, count }) => (
            <div key={director} className={styles.directorRow}>
              <span className={styles.directorName}>{director}</span>
              <span className={styles.directorCount}>{count} movies</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
