# @invai/ui

Shared React 19 + Tailwind v4 component library for **invai-web** (dense, data-heavy owner/office/vendor
dashboard) and **invai-floor** (huge-touch-target tablet PWA). Built on Radix primitives (via the unified
`radix-ui` package), `class-variance-authority`, TanStack Table + TanStack Virtual, `cmdk` and `sonner`.

## Setup for consuming apps

Both `invai-web` and `invai-floor` already depend on this package via `"@invai/ui": "link:../invai-ui"`
and already do `@import "@invai/ui/theme.css";` in their `src/styles.css`. One thing still needs adding
on their side: **Tailwind v4 does not scan `node_modules` by default**, and `@invai/ui` is a linked
package, so its class names (e.g. inside `DataTable`, `AppShell`, etc.) won't be generated unless the
consuming app tells Tailwind to look there. Add an `@source` line next to the theme import:

```css
/* invai-web/src/styles.css and invai-floor/src/styles.css */
@import "@invai/ui/theme.css";
@source "../../invai-ui/src";
```

(Path is relative to the CSS file; both apps live as siblings of `invai-ui`, so `../../invai-ui/src` is
correct from `<app>/src/styles.css`.)

Then import whatever you need from the package root:

```tsx
import { Button, DataTable, StatusBadge, initI18n } from "@invai/ui";

initI18n("en"); // or "es" — call once, e.g. in main.tsx
```

Mount `<Toaster />` once near your router root to enable `toast(...)` from `"sonner"` (re-exported here
as `toast`).

## Component list

**Base** — `Button` (variants `default`/`secondary`/`outline`/`ghost`/`destructive`/`success`; sizes
`sm`/`md`/`lg`/`xl`/`icon`, plus a `floor` size for tablet stations), `Input`, `Textarea`, `Label`,
`Select`, `Checkbox`, `Switch`, `RadioGroup`, `Badge`, `Card`, `Separator`, `Skeleton`, `Avatar`,
`Tooltip`, `Popover`, `DropdownMenu`, `Dialog`, `Sheet` (side drawer), `Tabs`, `Progress`, `Kbd`,
`Toaster`/`toast` (sonner), `ScrollArea`, `Command`/`CommandDialog` (cmdk, for a ⌘K palette).

**Data** — `DataTable` (TanStack Table + TanStack Virtual: sorting, checkbox row selection, sticky
header, column visibility, virtualized rows for thousands of rows, built-in loading/empty states, and
`onLoadMore`/`hasMore` for pagination-less "load more" instead of page numbers).

**App** — `AppShell` (collapsible sidebar with nav groups + top bar start/end slots + content),
`PageHeader`, `StatCard`, `EmptyState`, `StatusBadge` (color-coded for every `OrderItemState` in
`@invai/contracts`), `ChannelBadge` (neutral, no brand logos, for every `Channel`), `ConfidenceBadge`
(tone + icon + text for every `ConfidenceBand`: high → success/shield-check, medium →
warning/flask, low → outline/question mark; `label` overrides the text), `Money` (integer
cents → formatted `$12.34`) plus `formatMoney`, `RelativeTime`/`ShipByBadge` (ship-by turns red once
overdue, amber inside 24h, neutral otherwise) plus `formatRelativeTime`, `FileDrop` (drag-and-drop
upload).

**Floor** — `BigButton` (wraps `Button` at the `floor` size), `ScanResult` (full-screen green OK / red
BLOCKED panel), `PinPad` (4–6 digit numeric keypad for station PIN login), `StationHeader`.

**Theme** — `src/styles/theme.css`: Tailwind v4 `@theme` tokens, light by default, dark via the `.dark`
class (or `data-theme="dark"`) or `prefers-color-scheme: dark` when the app hasn't picked a theme.
Neutral base palette with a deep-teal brand accent, plus `success`/`warning`/`danger`/`info` status
colors and Inter/system font stack. Ships `tw-animate-css` for the `animate-in`/`fade-in-*`/`zoom-in-*`
utilities used by `Dialog`/`Sheet`/`Popover`/`Tooltip`/`DropdownMenu`.

**i18n** — `src/i18n`: i18next + react-i18next, `en`/`es` resources (nav labels, order states, station
names, scan results, common actions). `initI18n(lng)` initializes the singleton; components like
`StatusBadge` call `useTranslation()` against it, so call `initI18n` once before rendering.

**lib** — `cn` (`clsx` + `tailwind-merge`).

## Theming

Override any `--color-*` token from `src/styles/theme.css` in the consuming app after importing it, or
fork the token block entirely if a shop needs a different brand accent. Status colors
(`success`/`warning`/`danger`/`info`) are shared by `Badge`, `StatusBadge`, `StatCard`, `ScanResult` and
`ShipByBadge` — keep them in sync if you change the palette.

## Development

```
export PATH="$HOME/.local/share/pnpm/bin:$HOME/.local/share/pnpm:$PATH"
cd invai-ui
pnpm install
pnpm typecheck
pnpm lint
pnpm test        # vitest + @testing-library/react
pnpm playground  # http://localhost:5175 — every component on one page, for a visual check
```

Add new shadcn-style components under `src/components/` (or `src/app/`, `src/floor/` for the
higher-level ones), export them from `src/index.ts`, and add their strings to
`src/i18n/locales/{en,es}.json` if they render translated text.
