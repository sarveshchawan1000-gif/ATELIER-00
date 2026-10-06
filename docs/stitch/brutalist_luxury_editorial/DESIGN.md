---
name: Brutalist Luxury Editorial
colors:
  surface: '#fef9f1'
  surface-dim: '#ded9d2'
  surface-bright: '#fef9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3eb'
  surface-container: '#f2ede5'
  surface-container-high: '#ece8e0'
  surface-container-highest: '#e7e2da'
  on-surface: '#1d1c17'
  on-surface-variant: '#444748'
  inverse-surface: '#32302b'
  inverse-on-surface: '#f5f0e8'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#00687b'
  on-secondary: '#ffffff'
  secondary-container: '#00d9ff'
  on-secondary-container: '#005b6c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#858383'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#aeecff'
  secondary-fixed-dim: '#00d9ff'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5d'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#fef9f1'
  on-background: '#1d1c17'
  surface-variant: '#e7e2da'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 96px
    fontWeight: '700'
    lineHeight: 92px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 58px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 13px
    letterSpacing: 0.08em
  label-code:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.1em
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.25rem
  margin-desktop: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 3rem
---

## Brand & Style

This design system establishes an unapologetic collision between severe brutalism and high-fashion editorial curation. Designed for an avant-garde digital exhibition and retail environment, the aesthetic rejects mainstream consumer-grade softening in favor of stark architectural geometry, structural tension, and uncompromising negative space.

The emotional tone is austere, museum-grade, and authoritative. It evokes the tactile experience of heavyweight uncoated art paper, architectural concrete, and high-gloss gallery monographs. By pairing monumental, mechanical typography with ultra-fine structural dividers and razor-sharp geometries, the system repositions products not merely as goods, but as archived catalog pieces within a gallery collection.

## Colors

The palette is strictly architectural and non-decorative, engineered to mimic physical print media and gallery spatial surfaces:

- **Cream Canvas (`#F5F0E8`)**: The universal page background. Warm, tactile, non-glare foundation reminiscent of raw card stock.
- **Off-White Surface (`#FFFDF8`)**: Restricted to raised panels, product detail overlays, and card surfaces. Creates faint tonal separation against the cream canvas without artificial lighting effects.
- **Deep Black (`#111111`)**: Primary structural element. Used for display typography, heavy solid action buttons, active navigation, and primary iconography.
- **Charcoal (`#333333`)**: Body copy, secondary metadata, breadcrumbs, and non-emphasized technical product specifications.
- **Soft Architectural Grey (`#D8D5CF`)**: Strictly reserved for 1px hairline boundary rules, structural grid matrices, and table dividers.
- **Cyan Accent (`#00D9FF`)**: A hyper-vibrant industrial spot-color. Used solely for solid status pills, select hover floods, and flash alerts. Never used for text on cream backgrounds; typography set over Cyan surfaces must invariably be `#111111`.

Gradients, color blending modes, and multi-tone shadows are strictly prohibited across the entire design system.

## Typography

The typographic hierarchy constructs tension through contrast: mechanical, geometric headlines juxtaposed against calm, invisible editorial text.

- **Headlines (`Space Grotesk`)**: Monolithic, high-impact, set strictly in uppercase with negative tracking. Headlines function as architectural framing elements and graphic anchors rather than standard titles.
- **Body Text (`Inter`)**: Set strictly at standard reading scales in Charcoal (`#333333`) to prevent visual strain. It recedes cleanly behind exhibition imagery and monumental titles.
- **Metadata and UI Labels (`Space Grotesk`)**: Rendered in technical all-caps with generous letter-spacing (`0.06em` to `0.1em`) to evoke serial numbers, archival cataloging indices, and museum specimen plaques.

## Layout & Spacing

The layout is grounded in a 12-column rigid architectural grid framed by deliberate 1px structural dividing lines. Visual elements snap directly to grid intersections. 

- **Desktop (1440px+)**: 12-column layout with 3.5rem canvas borders and 2.5rem column gutters. Content rows are separated by horizontal 1px lines (`#D8D5CF`). Full-bleed exhibition heroes must maintain flush outer edge contact with margin guides.
- **Tablet (768px - 1439px)**: 8-column layout with 2rem margins and 1.5rem gutters. Product listings transition into balanced 2-column editorial sheets.
- **Mobile (< 768px)**: 4-column layout with 1.25rem outer boundary margins. Structural dividers stack vertically, presenting solitary exhibition items in full-width single-cell containers.

White space is treated as a solid structural material. Negative space between disparate collection groupings must expand up to `space-xl` (3rem or multiples thereof) to isolate editorial garments as individual artifacts.

## Elevation & Depth

This design system completely eliminates drop shadows, box blurs, and glassmorphic translucent effects. Physical elevation does not exist; structural depth is expressed solely through planar layering and 1px line logic:

- **Planes & Surfaces**: Layer depth is created by placing Off-White (`#FFFDF8`) cards directly upon the Cream (`#F5F0E8`) canvas.
- **Structural Outlines**: Panels, containers, and table cells are delineated by crisp 1px borders colored `#D8D5CF`. Overlapping elements employ high-contrast solid borders in `#111111` to assert optical dominance.
- **Modals & Drawers**: Cart slides and quick-view panels slide along the canvas as solid planes of `#FFFDF8` flanked by a rigid 1px solid `#111111` boundary edge. The backdrop screen overlay is a flat `#111111` wash at 40% opacity without Gaussian blur.

## Shapes

The shape system is strictly non-filleted (`roundedness: 0`). 

All interactive containers, images, input fields, badges, and action buttons maintain razor-sharp 0px right-angle corners. A maximum border radius of 2px to 4px is tolerated strictly when rendering native third-party micro-controls (e.g., standard browser scroll handles), but native system components must never deviate from absolute geometric square edges.

## Components

### Buttons
- **Primary Button**: Solid `#111111` background, `#FFFDF8` typography (`Space Grotesk`, uppercase, `label-lg`), 0px border radius, zero shadow. Padding: 16px vertical, 32px horizontal. On hover, the container instantly transitions to solid `#00D9FF`, and typography inverts to `#111111`.
- **Secondary Button**: Transparent background, 1px solid `#111111` border, `#111111` text. On hover, inverts to solid `#111111` with `#FFFDF8` text.
- **Ghost/Tertiary**: Text-only with a persistent 1px `#111111` underline offset by 4px. On hover, background shifts momentarily to `#00D9FF` padding fill.

### Tags & Chips
- Compact rectangular tags with 0px corner radius.
- Standard metadata tags utilize `#FFFDF8` background with a 1px `#D8D5CF` border and `#333333` label text.
- **Accent / Editorial Status Tags** (e.g., "ARCHIVE", "EDITION OF 10"): Solid `#00D9FF` background, `#111111` bold uppercase text, 0px border.

### Product Exhibition Cards
- Flat container with `#FFFDF8` surface background surrounded by a 1px `#D8D5CF` border.
- Photography is presented in high-contrast aspect ratios (4:5 or 1:1) flush to the top edge without interior padding.
- Card footer contains product index code (`label-code`), garment designation in `Space Grotesk` uppercase, and price in `Inter` Charcoal. Hovering over a card shifts the 1px perimeter border to `#111111`.

### Form Inputs
- Text inputs consist of `#FFFDF8` background surfaces enclosed by a 1px `#D8D5CF` border. Padding: 14px 16px. Typography is `Inter` 16px in `#111111`.
- Labels are positioned statically above inputs using `label-md` (`Space Grotesk`, uppercase, `#333333`).
- **Focus State**: Border transitions to a sharp 1px `#111111`. No glow, no rings.

### Checkboxes & Radio Controls
- **Checkboxes**: Precise 18px × 18px squares, 1px `#111111` outline, `#FFFDF8` fill. Checked state displays a solid `#111111` inner square block (leaving a 2px inner negative gap) or a solid `#00D9FF` fill block.
- **Radio Buttons**: Strictly square selectors matching the checkbox form to maintain brutalist consistency, indicated by an inner 8px solid `#111111` square when selected.

### Lists & Technical Spec Tables
- Horizontal full-width rows bordered by top and bottom 1px `#D8D5CF` rules.
- Row heights pegged at 48px to 64px with left-aligned specs in `label-md` uppercase and right-aligned details in `body-md` Charcoal. Alternating zebra strips are prohibited.

### Exhibition Navigation & Index
- Fixed-height header snapped to top margins, split into clean grid cells via vertical 1px `#D8D5CF` divider lines.
- Navigation links set in `label-lg` uppercase; active item is marked by a solid 3px `#111111` baseline underline or an adjoining solid `#00D9FF` 6px square glyph.