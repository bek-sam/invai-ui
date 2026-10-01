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

interface CachedFormatter {
  formatter: Intl.NumberFormat;
  /**
   * This locale's own digit-group separator ("." for bare `es`, "," for
   * `en`), or "" if a sample grouped amount didn't reveal one. See
   * `formatMoney` for why we need it ourselves.
   */
  groupSeparator: string;
}

const formatterCache = new Map<string, CachedFormatter>();

function getFormatter(locale: string, currency: string): CachedFormatter {
  const key = `${locale}:${currency}`;
  let cached = formatterCache.get(key);
  if (!cached) {
    const formatter = new Intl.NumberFormat(locale, { style: "currency", currency });
    // Sample a 5-digit amount, which every locale we've seen groups, to
    // learn this locale's separator character without hard-coding one.
    const groupSeparator =
      formatter.formatToParts(10000).find((p) => p.type === "group")?.value ?? "";
    cached = { formatter, groupSeparator };
    formatterCache.set(key, cached);
  }
  return cached;
}

/** Re-joins a run of digits into locale-style groups of 3 from the right. */
function groupDigits(digits: string, separator: string): string {
  if (digits.length <= 3) return digits;
  const firstGroupLength = digits.length % 3 || 3;
  const groups = [digits.slice(0, firstGroupLength)];
  for (let i = firstGroupLength; i < digits.length; i += 3) {
    groups.push(digits.slice(i, i + 3));
  }
  return groups.join(separator);
}

/**
 * Formats integer cents as a localized currency string, e.g. `1234` -> `$12.34`.
 *
 * Bare `es` CLDR data sets `minimumGroupingDigits: 2`, so a 4-digit amount
 * loses its thousands separator ("1234,56 US$") while 5+-digit amounts keep
 * it ("16.468,39 US$") — confusing next to each other (T-A6 review). The
 * installed `Intl.NumberFormat` (Node 24 / ICU 78, checked in
 * `node_modules/.pnpm/typescript@7.0.2/.../lib/lib.es5.d.ts` and
 * `lib.es2020.intl.d.ts`) has no `minimumGroupingDigits` option at all — it's
 * absent from both the type and `resolvedOptions()` at runtime — so we can't
 * just pass it. Instead we detect the missing separator via `formatToParts`
 * and re-group the digits ourselves with this locale's own separator
 * character; every other locale (including `en`, which never hits this)
 * already groups correctly and takes the untouched path.
 */
export function formatMoney(cents: number, currency = "USD", locale = i18n.language || "en") {
  const { formatter, groupSeparator } = getFormatter(locale, currency);
  const parts = formatter.formatToParts(cents / 100);
  const needsFix = groupSeparator !== "" && !parts.some((p) => p.type === "group");
  return parts
    .map((p) => (needsFix && p.type === "integer" ? groupDigits(p.value, groupSeparator) : p.value))
    .join("");
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
