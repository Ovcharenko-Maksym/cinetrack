import { validateRegister, validateLogin, validateMovieForm } from '../../client/src/utils/validate.js';

describe('validateRegister', () => {
  test('empty name returns error', () => {
    const result = validateRegister({
      name: '',
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  test('invalid email returns error', () => {
    const result = validateRegister({
      name: 'John',
      email: 'invalid-email',
      password: '123456',
      confirmPassword: '123456',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  test('password under 6 chars returns error', () => {
    const result = validateRegister({
      name: 'John',
      email: 'test@example.com',
      password: '123',
      confirmPassword: '123',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });

  test('passwords do not match returns error', () => {
    const result = validateRegister({
      name: 'John',
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '654321',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.confirmPassword).toBeDefined();
  });

  test('valid data returns isValid true', () => {
    const result = validateRegister({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepass',
      confirmPassword: 'securepass',
    });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});

describe('validateLogin', () => {
  test('empty email returns error', () => {
    const result = validateLogin({ email: '', password: '123456' });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  test('empty password returns error', () => {
    const result = validateLogin({ email: 'test@example.com', password: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });

  test('valid data returns isValid true', () => {
    const result = validateLogin({ email: 'test@example.com', password: '123456' });
    expect(result.isValid).toBe(true);
  });
});

describe('validateMovieForm', () => {
  test('missing rating returns error', () => {
    const result = validateMovieForm({ userRating: 0, review: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.userRating).toBeDefined();
  });

  test('review over 500 chars returns error', () => {
    const result = validateMovieForm({ userRating: 8, review: 'a'.repeat(501) });
    expect(result.isValid).toBe(false);
    expect(result.errors.review).toBeDefined();
  });

  test('valid data returns isValid true', () => {
    const result = validateMovieForm({ userRating: 8, review: 'Great movie!' });
    expect(result.isValid).toBe(true);
  });
});
