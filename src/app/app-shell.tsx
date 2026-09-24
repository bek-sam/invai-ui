import type { LucideIcon } from "lucide-react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/tooltip";
import { cn } from "../lib/cn";

export interface AppShellNavItem {
  key: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  active?: boolean;
}

export interface AppShellNavGroup {
  label?: string;
  items: AppShellNavItem[];
}

export interface AppShellProps {
  navGroups: AppShellNavGroup[];
  /** App/company mark shown at the top of the sidebar. */
  logo?: React.ReactNode;
  /** Left side of the top bar (breadcrumbs, station picker, etc). */
  topBarStart?: React.ReactNode;
  /** Right side of the top bar (search, notifications, user menu). */
  topBarEnd?: React.ReactNode;
  /** Wrap a nav item in the host app's router `Link`. Defaults to a plain anchor. */
  renderNavLink?: (item: AppShellNavItem, content: React.ReactNode) => React.ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * The web dashboard's shell: a collapsible sidebar with nav groups, a top bar with
 * left/right slots, and a scrollable content area. Role-based nav is the caller's
 * job — pass only the groups/items the current role can see.
 */
export function AppShell({
  navGroups,
  logo,
  topBarStart,
  topBarEnd,
  renderNavLink,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  children,
  className,
}: AppShellProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;

  function toggleCollapsed() {
    const next = !collapsed;
    setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn("flex h-dvh w-full overflow-hidden bg-background text-foreground", className)}
      >
        <aside
          className={cn(
            "flex shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200",
            collapsed ? "w-14" : "w-60",
          )}
        >
          <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
            {logo}
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {navGroups.map((group, i) => (
              <div key={group.label ?? i} className="mb-4 last:mb-0">
                {group.label && !collapsed && (
                  <p className="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                )}
                <ul className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const linkContent = (
                      <span
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          item.active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {!collapsed && item.badge}
                      </span>
                    );
                    const link = renderNavLink ? (
                      renderNavLink(item, linkContent)
                    ) : (
                      <a href={item.href}>{linkContent}</a>
                    );
                    return (
                      <li key={item.key}>
                        {collapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>{link}</TooltipTrigger>
                            <TooltipContent side="right">{item.label}</TooltipContent>
                          </Tooltip>
                        ) : (
                          link
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <button
            type="button"
            onClick={toggleCollapsed}
            className="flex h-10 shrink-0 items-center justify-center border-t border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          </button>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-4">
            <div className="flex min-w-0 items-center gap-3">{topBarStart}</div>
            <div className="flex shrink-0 items-center gap-3">{topBarEnd}</div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
