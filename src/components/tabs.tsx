import { Tabs as TabsPrimitive } from "radix-ui";
import type * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "../lib/cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const ref = useRef<HTMLButtonElement>(null);
  // Radix always points a trigger's aria-controls at its panel's id, but it only mounts the
  // *active* tab's <TabsContent> (and some pages use Tabs as a segmented filter control with no
  // TabsContent at all) — so an aria-controls referencing an element that isn't in the DOM is an
  // invalid ARIA reference (axe: aria-valid-attr-value). Keep it in sync with what's really
  // there, entirely inside this wrapper: no caller has to know or care.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let original = el.getAttribute("data-controls-id");
    if (original === null) {
      original = el.getAttribute("aria-controls");
      if (original) el.setAttribute("data-controls-id", original);
    }
    if (!original) return;
    if (document.getElementById(original)) {
      if (el.getAttribute("aria-controls") !== original) el.setAttribute("aria-controls", original);
    } else if (el.hasAttribute("aria-controls")) {
      el.removeAttribute("aria-controls");
    }
  });
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}
