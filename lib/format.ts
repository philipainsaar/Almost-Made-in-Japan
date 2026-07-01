import type { MoneyV2 } from './shopify';

export function formatMoney(money?: MoneyV2 | null) {
  if (!money) return '';
  const amount = Number(money.amount);
  const currency = money.currencyCode || 'SEK';
  if (!Number.isFinite(amount)) return `${money.amount} ${currency}`;
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`;
}

export function normalizeHandle(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}
