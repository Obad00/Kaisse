export function formatCurrency(amount: number, currency = "FCFA"): string {
  const rounded = Math.round(amount);
  const withSeparators = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${withSeparators} ${currency}`;
}
