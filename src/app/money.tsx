import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";

export interface MoneyProps {
  /** Integer cents, USD (per CLAUDE.md: money is always integer cents). */
  cents: number;
  className?: string;
  /** Show a leading + for positive values (useful for deltas). */
  showSign?: boolean;
  currency?: string;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string, currency: string) {
  const key = `${locale}:${currency}`;
  let f = formatterCache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale, { style: "currency", currency });
    formatterCache.set(key, f);
  }
  return f;
}

/** Formats integer cents as a localized currency string, e.g. `1234` -> `$12.34`. */
export function formatMoney(cents: number, currency = "USD", locale = i18n.language || "en") {
  return getFormatter(locale, currency).format(cents / 100);
}

/** Renders integer cents as `$12.34`. Negative values render with a leading minus, in the app locale. */
export function Money({ cents, className, showSign = false, currency = "USD" }: MoneyProps) {
  const { i18n: instance } = useTranslation();
  const formatted = formatMoney(Math.abs(cents), currency, instance.language || "en");
  const sign = cents < 0 ? "-" : showSign && cents > 0 ? "+" : "";
  return (
    <span
      className={cn(
        "tabular-nums",
        cents < 0 && "text-danger",
        showSign && cents > 0 && "text-success",
        className,
      )}
    >
      {sign}
      {formatted}
    </span>
  );
}
