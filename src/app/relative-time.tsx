import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();

function getRtf(locale: string) {
  let f = rtfCache.get(locale);
  if (!f) {
    f = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    rtfCache.set(locale, f);
  }
  return f;
}

/** Formats an ISO timestamp relative to now, in the app locale, e.g. "in 3 hours" / "hace 4 semanas". */
export function formatRelativeTime(
  iso: string,
  now: Date = new Date(),
  locale = i18n.language || "en",
) {
  const rtf = getRtf(locale);
  const diffSeconds = (new Date(iso).getTime() - now.getTime()) / 1000;
  const abs = Math.abs(diffSeconds);
  if (abs < 60) return rtf.format(Math.round(diffSeconds), "second");
  for (const [unit, secondsInUnit] of UNITS) {
    if (abs >= secondsInUnit) return rtf.format(Math.round(diffSeconds / secondsInUnit), unit);
  }
  return rtf.format(Math.round(diffSeconds / 60), "minute");
}

export interface RelativeTimeProps {
  /** ISO timestamp. */
  value: string;
  className?: string;
  now?: Date;
}

/** A `<time>` element showing a relative timestamp, in the app locale, with the absolute time on hover. */
export function RelativeTime({ value, className, now }: RelativeTimeProps) {
  const { i18n: instance } = useTranslation();
  const locale = instance.language || "en";
  return (
    <time dateTime={value} title={new Date(value).toLocaleString(locale)} className={cn(className)}>
      {formatRelativeTime(value, now, locale)}
    </time>
  );
}

export interface ShipByBadgeProps {
  /** ISO ship-by deadline. */
  shipBy: string;
  className?: string;
  now?: Date;
}

/**
 * Order Hub ship-by indicator: red once overdue, amber inside 24h, neutral otherwise.
 * Matches the "sorted by real ship-by, at-risk alerts" requirement from the v1 plan.
 */
export function ShipByBadge({ shipBy, className, now = new Date() }: ShipByBadgeProps) {
  const { i18n: instance } = useTranslation();
  const diffMs = new Date(shipBy).getTime() - now.getTime();
  const hours = diffMs / 3_600_000;
  const tone = hours < 0 ? "danger" : hours < 24 ? "warning" : "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums",
        tone === "danger" && "border-transparent bg-danger text-danger-foreground",
        tone === "warning" && "border-transparent bg-warning text-warning-foreground",
        tone === "neutral" && "border-border text-muted-foreground",
        className,
      )}
    >
      {formatRelativeTime(shipBy, now, instance.language || "en")}
    </span>
  );
}
