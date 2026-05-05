import { formatRuntime } from '../../client/src/utils/format.js';

describe('formatRuntime', () => {
  test('formatRuntime("142 min") returns "2h 22m"', () => {
    expect(formatRuntime('142 min')).toBe('2h 22m');
  });

  test('formatRuntime("90 min") returns "1h 30m"', () => {
    expect(formatRuntime('90 min')).toBe('1h 30m');
  });

  test('formatRuntime("60 min") returns "1h"', () => {
    expect(formatRuntime('60 min')).toBe('1h');
  });

  test('formatRuntime("45 min") returns "45m"', () => {
    expect(formatRuntime('45 min')).toBe('45m');
  });

  test('formatRuntime(null) returns empty string', () => {
    expect(formatRuntime(null)).toBe('');
  });
});
