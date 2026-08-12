import { extractError } from '../extract-error';

describe('extractError', () => {
  it('returns string data as-is', () => {
    expect(extractError('Server error')).toBe('Server error');
  });

  it('flattens an array of errors', () => {
    const result = extractError(['first', 'second']);
    expect(result).toContain('first');
    expect(result).toContain('second');
  });

  it('formats object entries with keys', () => {
    const result = extractError({ email: 'is invalid' });
    expect(result).toContain('- email: is invalid');
  });

  it('uses a newline separator for array values inside objects', () => {
    const result = extractError({ errors: ['a', 'b'] });
    expect(result).toContain('- errors:\n ');
    expect(result).toContain('a');
    expect(result).toContain('b');
  });

  it('recurses into nested objects', () => {
    const result = extractError({ user: { name: 'required' } });
    expect(result).toContain('- user: - name: required');
  });

  it('returns a fallback for null, undefined, and primitives', () => {
    expect(extractError(null)).toContain('Something went wrong');
    expect(extractError(undefined)).toContain('Something went wrong');
    expect(extractError(42)).toContain('Something went wrong');
  });
});
