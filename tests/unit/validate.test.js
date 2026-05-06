import { validateRegister, validateLogin, validateMovieForm } from '../../client/src/utils/validate.js';

describe('Client Validation', () => {
  test('validateRegister — rejects invalid data, accepts valid', () => {
    const invalid = validateRegister({ name: '', email: 'bad', password: '123', confirmPassword: '456' });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.name).toBeDefined();
    expect(invalid.errors.email).toBeDefined();
    expect(invalid.errors.password).toBeDefined();
    expect(invalid.errors.confirmPassword).toBeDefined();

    const valid = validateRegister({ name: 'John', email: 'j@e.com', password: '123456', confirmPassword: '123456' });
    expect(valid.isValid).toBe(true);
  });

  test('validateLogin — rejects empty fields, accepts valid', () => {
    expect(validateLogin({ email: '', password: '' }).isValid).toBe(false);
    expect(validateLogin({ email: 'test@example.com', password: '123456' }).isValid).toBe(true);
  });

  test('validateMovieForm — rejects bad rating/long review', () => {
    expect(validateMovieForm({ userRating: 0, review: '' }).isValid).toBe(false);
    expect(validateMovieForm({ userRating: 8, review: 'a'.repeat(501) }).isValid).toBe(false);
    expect(validateMovieForm({ userRating: 8, review: 'Great!' }).isValid).toBe(true);
  });
});
