import type { Station } from "@invai/contracts";
import { Wifi, WifiOff } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";

export interface StationHeaderProps {
  station: Station;
  stationLabel: string;
  /** Signed-in floor worker's display name. */
  operatorName?: string;
  online?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

/** Top bar for a floor station screen: station name, operator, connectivity, and exit/actions. */
export function StationHeader({
  station,
  stationLabel,
  operatorName,
  online = true,
  actions,
  className,
}: StationHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-6",
        className,
      )}
      data-station={station}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-foreground">{stationLabel}</span>
        {operatorName && <span className="text-lg text-muted-foreground">{operatorName}</span>}
      </div>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium",
            online ? "text-success" : "text-danger",
          )}
        >
          {online ? <Wifi className="size-5" /> : <WifiOff className="size-5" />}
          {online ? "Online" : "Offline"}
        </span>
        {actions}
      </div>
    </header>
  );
}
