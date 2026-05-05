import { useAuth } from '../context/AuthContext';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          {getInitials(user?.name)}
        </div>
        <h1 className={styles.name}>{user?.name || 'User'}</h1>
        <p className={styles.email}>{user?.email || 'user@example.com'}</p>
        <p className={styles.since}>Member since January 2026</p>

        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <div className={styles.quickStatValue}>47</div>
            <div className={styles.quickStatLabel}>Watched</div>
          </div>
          <div className={styles.quickStat}>
            <div className={styles.quickStatValue}>7.8</div>
            <div className={styles.quickStatLabel}>Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
