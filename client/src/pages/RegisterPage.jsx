import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../api';
import { validateRegister } from '../utils/validate';
import styles from './AuthPage.module.css';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateRegister(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    try {
      const { user, token } = await register(form.name, form.email, form.password);
      authLogin(user, token);
      navigate('/');
    } catch (err) {
      setErrors({ email: 'Registration failed. Try again.' });
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Create Account</h1>
      <p className={styles.subtitle}>Join CineTrack to track your movies</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Full Name</label>
          <input
            type="text"
            name="name"
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          {errors.name && <div className={styles.error}>{errors.name}</div>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            value={form.password}
            onChange={handleChange}
            placeholder="Min. 6 characters"
          />
          {errors.password && <div className={styles.error}>{errors.password}</div>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
          />
          {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className={styles.submit}>Create Account</button>
      </form>

      <div className={styles.footer}>
        Already have an account? <Link to="/login" className={styles.footerLink}>Sign in</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
