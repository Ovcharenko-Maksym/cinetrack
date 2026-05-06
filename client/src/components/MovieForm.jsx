import { useState } from 'react';
import { validateMovieForm } from '../utils/validate';
import styles from './MovieForm.module.css';

function MovieForm({ onSubmit, onCancel, initialRating = 0, initialReview = '' }) {
  const [userRating, setUserRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview || '');
  const [errors, setErrors] = useState({});
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateMovieForm({ userRating, review });
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ userRating, review: review.trim() || null });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Your Rating</label>
        <div className={styles.stars}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <span
              key={num}
              className={`${styles.star} ${num <= (hoverRating || userRating) ? styles.starActive : ''}`}
              onClick={() => setUserRating(num)}
              onMouseEnter={() => setHoverRating(num)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>
        {errors.userRating && <div className={styles.error}>{errors.userRating}</div>}
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Review (optional)</label>
        <textarea
          className={styles.textarea}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your thoughts about this movie..."
          maxLength={500}
        />
        <div className={`${styles.charCount} ${review.length > 500 ? styles.charCountOver : ''}`}>
          {review.length}/500
        </div>
        {errors.review && <div className={styles.error}>{errors.review}</div>}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.btnSubmit}>Submit</button>
        <button type="button" className={styles.btnCancel} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default MovieForm;
