import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

function SearchBar({ onSearch, loading = false }) {
  const [value, setValue] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (value.trim()) {
      timerRef.current = setTimeout(() => {
        onSearch(value.trim());
      }, 400);
    } else {
      onSearch('');
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrap}>
        <span className={styles.icon}>🔍</span>
        <input
          type="text"
          className={styles.input}
          placeholder="Search movies by title..."
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
