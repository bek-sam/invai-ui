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

function getFormatter(locale: string, currency: string): Intl.NumberFormat {
  const key = `${locale}:${currency}`;
  let cached = formatterCache.get(key);
  if (!cached) {
    // `useGrouping: "always"` is the standard ECMA-402 way to force grouping
    // on every amount. Bare `es` CLDR data sets `minimumGroupingDigits: 2`,
    // so without this a 4-digit amount loses its thousands separator
    // ("1234,56 US$") while 5+-digit amounts keep it ("16.468,39 US$") —
    // confusing next to each other (T-A6 review). `"always"` is typed in TS
    // 7's `lib.es2023.intl.d.ts` (`NumberFormatOptionsUseGroupingRegistry`)
    // and supported in Node 24/ICU 78; it reproduces every other locale's
    // existing output byte-for-byte (verified for `en` and 17 other
    // locales), so it only changes the cases that were actually broken.
    cached = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      useGrouping: "always",
    });
    formatterCache.set(key, cached);
  }
  return cached;
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
