import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

const MODES = [
  { id: 'all', label: 'By Title' },
  { id: 'director', label: 'By Director' },
];

function SearchBar({ onSearch, loading = false }) {
  const [value, setValue] = useState('');
  const [mode, setMode] = useState('all');
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (value.trim()) {
      timerRef.current = setTimeout(() => {
        onSearch(value.trim(), mode);
      }, 400);
    } else {
      onSearch('', mode);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, mode]);

  const handleClear = () => {
    setValue('');
    onSearch('', mode);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const placeholder = mode === 'director'
    ? 'Enter director name (e.g. Christopher Nolan)...'
    : 'Search movies by title...';

  return (
    <div className={styles.wrapper}>
      <div className={styles.modes}>
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`${styles.modeBtn} ${mode === m.id ? styles.modeBtnActive : ''}`}
            onClick={() => handleModeChange(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className={styles.inputWrap}>
        <span className={styles.icon}>🔍</span>
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {loading && <div className={styles.spinner} />}
        {value && !loading && (
          <button className={styles.clear} onClick={handleClear}>×</button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
