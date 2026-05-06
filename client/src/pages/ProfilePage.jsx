import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getUserStats, updateUserProfile } from '../api';
import { useToast } from '../components/Toast';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const toast = useToast();

  useEffect(() => {
    Promise.all([getUserProfile(), getUserStats()])
      .then(([profileData, statsData]) => {
        setProfile(profileData);
        setStats(statsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const handleEditStart = () => {
    setEditName(profile?.name || '');
    setEditing(true);
  };

  const handleEditSave = async () => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    try {
      const updated = await updateUserProfile({ name: editName.trim() });
      setProfile(updated);
      setEditing(false);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className={styles.page}><div className={styles.loading}>Loading profile...</div></div>;
  }

  const displayName = profile?.name || user?.name || 'User';
  const displayEmail = profile?.email || user?.email || '';

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          {getInitials(displayName)}
        </div>

        {editing ? (
          <div className={styles.editRow}>
            <input
              className={styles.editInput}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
            />
            <button className={styles.btnSave} onClick={handleEditSave}>Save</button>
            <button className={styles.btnCancel} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className={styles.nameRow}>
            <h1 className={styles.name}>{displayName}</h1>
            <button className={styles.btnEdit} onClick={handleEditStart}>Edit</button>
          </div>
        )}

        <p className={styles.email}>{displayEmail}</p>
        <p className={styles.since}>
          Member since {formatDate(profile?.createdAt)}
        </p>

        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <div className={styles.quickStatValue}>{stats?.totalWatched ?? 0}</div>
            <div className={styles.quickStatLabel}>Watched</div>
          </div>
          <div className={styles.quickStat}>
            <div className={styles.quickStatValue}>{stats?.avgRating ? stats.avgRating.toFixed(1) : '—'}</div>
            <div className={styles.quickStatLabel}>Avg Rating</div>
          </div>
          <div className={styles.quickStat}>
            <div className={styles.quickStatValue}>{stats?.reviewsCount ?? 0}</div>
            <div className={styles.quickStatLabel}>Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
