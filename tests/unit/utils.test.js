import { formatRuntime } from '../../client/src/utils/format.js';

describe('formatRuntime', () => {
  test('converts minutes to human-readable format', () => {
    expect(formatRuntime('142 min')).toBe('2h 22m');
    expect(formatRuntime('45 min')).toBe('45m');
    expect(formatRuntime(null)).toBe('');
  });
});
