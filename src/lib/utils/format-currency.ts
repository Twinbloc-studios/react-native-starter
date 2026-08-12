/**
 * Formats a number as a currency string.
 * @param amount - The amount to format.
 * @param currency - The currency code (default: 'NGN').
 * @param locale - The locale to use (default: 'en-NG').
 * @returns The formatted currency string.
 */
export function formatCurrency(
  amount: number | string = 0,
  currency: string = 'NGN',
  locale: string = 'en-NG',
) {
  return (Number(amount) || 0).toLocaleString(locale, {
    style: 'currency',
    currency,
  });
}
