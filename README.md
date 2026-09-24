# invai-ui

Shared UI for **invai-web** (dashboard) and **invai-floor** (tablet app):

- `src/components/`: shadcn/ui components, owned and edited here. Add new ones with the shadcn CLI, then move them into this repo.
- `src/styles/theme.css`: Tailwind v4 theme tokens (light and dark).
- `src/i18n/`: i18next setup plus `en` and `es` strings. Floor staff pick their language.

Buttons have a `floor` size (64px+ targets, large type) for the tablet stations.

Consumers link it locally with `"@invai/ui": "link:../invai-ui"` and import `@invai/ui/theme.css` once in their CSS entry.
