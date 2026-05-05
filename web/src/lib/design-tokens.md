# AAUClubManager Design Tokens

Source of truth: `docs/wiki/ux/design-system.md`
Implementation: `web/src/app/globals.css` (Tailwind v4 `@theme` directive)

## Architecture

This project uses **Tailwind CSS v4** (no `tailwind.config.ts`). All token
customization is done via CSS `@theme` directives in `globals.css`. Tailwind
v4 reads these at build time and generates utility classes automatically.

Shadcn/ui components use CSS custom properties (`--primary`, `--foreground`,
etc.) which are declared in `:root {}` in `globals.css`. The `@theme` block
bridges these CSS variables to Tailwind utility classes.

## Color Tokens

### Primary — Club Blue (PLACEHOLDER)
> Brand color is currently `#3b82f6`. This is a placeholder.
> Pending: user confirms final brand color (pmo/pending-decisions/PHASE-0.md #1).
> To update: change `--color-primary-*` values in `globals.css` and rebuild.

| CSS variable | Hex | Tailwind class |
|---|---|---|
| `--color-primary-50` | `#eff6ff` | `bg-primary-50`, `text-primary-50` |
| `--color-primary-100` | `#dbeafe` | `bg-primary-100`, `text-primary-100` |
| `--color-primary-500` | `#3b82f6` | `bg-primary-500`, `text-primary-500` |
| `--color-primary-600` | `#2563eb` | `bg-primary-600`, `text-primary-600` |
| `--color-primary-700` | `#1d4ed8` | `bg-primary-700`, `text-primary-700` |
| `--color-primary-900` | `#1e3a8a` | `bg-primary-900`, `text-primary-900` |

### shadcn/ui CSS variable bridge

The `--primary` CSS var maps to `primary-500` so shadcn components render
with the brand color without any additional config.

## Typography

- **Font:** Inter (loaded via `next/font/google`) — headings + body
- **Mono:** JetBrains Mono — not yet loaded (Phase 1, when needed for jersey numbers/IDs)
- **Scale:** Tailwind default (`text-xs` through `text-4xl`)
- **Weights:** `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)

## Spacing

Tailwind default 4px base. Use `space-{N}` where N maps to 4px increments.
No arbitrary values — use the nearest token.

## Accessibility

- `prefers-reduced-motion` rule in `globals.css` disables all animations/transitions
- Focus ring: `2px solid var(--ring)` with `2px` offset (maps to primary-500)
- Contrast targets: WCAG 2.1 AA (4.5:1 body text, 3:1 UI components)
