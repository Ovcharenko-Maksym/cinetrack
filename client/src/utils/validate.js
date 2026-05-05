const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister({ name, email, password, confirmPassword }) {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLogin({ email, password }) {
  const errors = {};

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateMovieForm({ userRating, review }) {
  const errors = {};

  if (!userRating || userRating < 1 || userRating > 10) {
    errors.userRating = 'Please select a rating between 1 and 10';
  }

  if (review && review.length > 500) {
    errors.review = 'Review must be 500 characters or less';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
