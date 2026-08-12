import { formatCurrency } from '../format-currency';

describe('formatCurrency', () => {
  it('formats with default currency NGN and locale en-NG', () => {
    // Defaults may vary by ICU data; assert it produces a currency-formatted
    // string containing the amount and currency marker.
    const result = formatCurrency(1250.5);
    expect(result).toContain('1,250.50');
    expect(result).toMatch(/NGN|₦/);
  });

  it('formats with an explicit currency and locale', () => {
    const result = formatCurrency(42, 'USD', 'en-US');
    expect(result).toContain('42.00');
    expect(result).toMatch(/USD|\$/);
  });

  it('accepts a numeric string', () => {
    const result = formatCurrency('99.9', 'USD', 'en-US');
    expect(result).toContain('99.90');
  });

  it('coerces invalid values to 0', () => {
    const result = formatCurrency('not-a-number', 'USD', 'en-US');
    expect(result).toContain('0.00');
  });

  it('defaults to 0 when no amount is passed', () => {
    const result = formatCurrency(undefined, 'USD', 'en-US');
    expect(result).toContain('0.00');
  });
});
