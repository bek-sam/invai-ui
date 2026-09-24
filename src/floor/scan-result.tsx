import { CheckCircle2, XCircle } from "lucide-react";
import type * as React from "react";
import { cn } from "../lib/cn";

export interface ScanResultProps {
  status: "ok" | "blocked";
  title: string;
  /** Extra detail lines, e.g. order number, item, expected vs. scanned. */
  details?: string[];
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Full-screen scan feedback for the floor PWA: a big green OK panel or a big red
 * BLOCKED panel, meant to be readable from arm's length at the press. Pair with a
 * success/error sound in the app (audio is a host concern, not this component's).
 */
export function ScanResult({ status, title, details, actions, className }: ScanResultProps) {
  const ok = status === "ok";
  const Icon = ok ? CheckCircle2 : XCircle;
  return (
    <div
      role="alert"
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-6 p-10 text-center",
        ok ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground",
        className,
      )}
    >
      <Icon className="size-32" strokeWidth={1.5} aria-hidden />
      <h1 className="text-5xl font-bold uppercase tracking-wide">{title}</h1>
      {details && details.length > 0 && (
        <div className="flex flex-col gap-1 text-xl opacity-90">
          {details.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
      {actions && <div className="mt-4 flex gap-4">{actions}</div>}
    </div>
  );
}
