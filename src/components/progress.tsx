import { Progress as ProgressPrimitive } from "radix-ui";
import type * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";

export function Progress({
  className,
  value,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const { t } = useTranslation();
  // A progressbar needs an accessible name (axe: aria-progressbar-name). Callers that have
  // something more specific to say can still pass their own aria-label/aria-labelledby, which
  // wins over this fallback since it's destructured out and re-applied before `...props`.
  const resolvedLabel =
    ariaLabel ?? t("progress.percentLabel", "{{value}}%", { value: value ?? 0 });
  return (
    <ProgressPrimitive.Root
      aria-label={resolvedLabel}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-transform"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
