import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../api';
import { validateLogin } from '../utils/validate';
import styles from './AuthPage.module.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
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
    const { isValid, errors: validationErrors } = validateLogin(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    try {
      const { user, token } = await apiLogin(form.email, form.password);
      authLogin(user, token);
      navigate('/');
    } catch (err) {
      setErrors({ email: 'Invalid credentials. Try again.' });
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Welcome Back</h1>
      <p className={styles.subtitle}>Sign in to your CineTrack account</p>

      <form onSubmit={handleSubmit}>
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
            placeholder="Your password"
          />
          {errors.password && <div className={styles.error}>{errors.password}</div>}
        </div>

        <button type="submit" className={styles.submit}>Sign In</button>
      </form>

      <div className={styles.footer}>
        Don't have an account? <Link to="/register" className={styles.footerLink}>Create one</Link>
      </div>
    </div>
  );
}

export default LoginPage;
