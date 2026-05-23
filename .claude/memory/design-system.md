# SOLACE — Design System

This file holds technical design tokens and component standards.
For aesthetic philosophy and look-and-feel, see design-ideology.md.

## Theme System

4 themes × 2 modes (light/dark) = 8 total palettes.

Themes:
- **Sage** (default) — warm nature greens
- **Blush** — soft rose
- **Dusk** — muted blue
- **Honey** — warm amber

Theme implementation: CSS variables on root, switched via data attribute.

## Typography

- **Display / emotional moments:** Fraunces (serif)
- **Body / UI:** DM Sans (sans-serif)
- **Journal entries:** Caveat or Kalam (handwriting)

## Spacing

Tailwind defaults, but bias toward generous whitespace.
Cards: 24px internal padding minimum.
Sections: 64px vertical separation.

## Animation Tokens

- Default spring: `{ stiffness: 200, damping: 20 }`
- Page transitions: 400ms ease-out
- Micro-interactions: 200ms
- Always respect `prefers-reduced-motion`

## Component Standards

(Filled in as components are built and standardized.)