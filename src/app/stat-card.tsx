import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import type * as React from "react";
import { Card } from "../components/card";
import { cn } from "../lib/cn";

export type StatCardTone = "neutral" | "success" | "warning" | "danger" | "info";

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  /** Small trailing indicator, e.g. "+12% vs last week" or "-3". */
  delta?: string;
  /** Direction the delta represents; only affects color/arrow, not the sign shown in `delta`. */
  deltaDirection?: "up" | "down";
  tone?: StatCardTone;
  icon?: LucideIcon;
  className?: string;
}

const TONE_RING: Record<StatCardTone, string> = {
  neutral: "border-border",
  success: "border-success/40",
  warning: "border-warning/40",
  danger: "border-danger/40",
  info: "border-info/40",
};

const TONE_ICON_BG: Record<StatCardTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
};

/** "Today" command-center tile: a label, a big value, and an optional trend delta. */
export function StatCard({
  label,
  value,
  delta,
  deltaDirection = "up",
  tone = "neutral",
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border p-4", TONE_RING[tone], className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <span
            className={cn("flex size-8 items-center justify-center rounded-md", TONE_ICON_BG[tone])}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      {delta && (
        <p
          className={cn(
            "mt-1 inline-flex items-center gap-0.5 text-xs font-medium",
            deltaDirection === "up" ? "text-success" : "text-danger",
          )}
        >
          {deltaDirection === "up" ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          )}
          {delta}
        </p>
      )}
    </Card>
  );
}
