import { useState, useEffect } from 'react';
import { getUserStats, getUserActivity, getUserMovies } from '../api';
import Heatmap from '../components/Heatmap';
import GenreChart from '../components/GenreChart';
import RatingHistogram from '../components/RatingHistogram';
import styles from './StatsPage.module.css';

function StatsPage() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [topDirectors, setTopDirectors] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getUserStats(),
      getUserActivity(new Date().getFullYear()),
      getUserMovies('watched'),
    ]).then(([statsData, activityData, watchedMovies]) => {
      setStats(statsData);
      setActivity(activityData);

      const genreCount = {};
      const directorCount = {};

      watchedMovies.forEach((item) => {
        const movie = item.movie;
        if (!movie) return;

        if (movie.genre) {
          movie.genre.split(',').forEach((g) => {
            const genre = g.trim();
            if (genre) genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        }
        if (movie.director) {
          movie.director.split(',').forEach((d) => {
            const director = d.trim();
            if (director) directorCount[director] = (directorCount[director] || 0) + 1;
          });
        }
      });

      setTopGenres(
        Object.entries(genreCount)
          .map(([genre, count]) => ({ genre, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8)
      );
      setTopDirectors(
        Object.entries(directorCount)
          .map(([director, count]) => ({ director, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8)
      );

      let minutes = 0;
      watchedMovies.forEach((item) => {
        const rt = item.movie?.runtime;
        if (rt) {
          const m = rt.match(/(\d+)/);
          if (m) minutes += parseInt(m[1], 10);
        }
      });
      setTotalMinutes(minutes);

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading stats...</div>;
  }

  const totalHours = Math.round(totalMinutes / 60);

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
          <div className={styles.statValue}>{stats.avgRating ? stats.avgRating.toFixed(1) : '—'}</div>
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

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top Genres</h2>
          {topGenres.length > 0 ? (
            <GenreChart genres={topGenres} />
          ) : (
            <p className={styles.emptyHint}>Watch movies to see your top genres</p>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Rating Distribution</h2>
          {stats.totalWatched > 0 ? (
            <RatingHistogram distribution={stats.ratingDistribution} />
          ) : (
            <p className={styles.emptyHint}>Rate movies to see your distribution</p>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Top Directors</h2>
        {topDirectors.length > 0 ? (
          <div className={styles.directors}>
            {topDirectors.map(({ director, count }) => (
              <div key={director} className={styles.directorRow}>
                <span className={styles.directorName}>{director}</span>
                <span className={styles.directorCount}>{count} {count === 1 ? 'movie' : 'movies'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyHint}>Watch movies to see your top directors</p>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
