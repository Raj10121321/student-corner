---
name: Synthetic Velocity
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base-unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is engineered for high-performance event coordination and technical hackathons. The brand personality is **trustworthy, functional, and tech-forward**, prioritizing clarity of information over decorative flair. 

The visual style is a refined **Corporate Modern** approach with a deep dark-mode foundation. It leverages high-contrast typography and precise geometric alignments to evoke a sense of professional reliability. The interface uses a "layer-on-layer" logic where depth is communicated through subtle tonal shifts rather than aggressive shadows, ensuring the UI feels integrated and systematic.

## Colors

The color palette is anchored in a deep slate environment to reduce eye strain during long-form coordination and coding sessions.

- **Primary Indigo (#6366F1)**: Reserved for primary actions, progress indicators, and brand-heavy moments.
- **Secondary Blue (#3B82F6)**: Used for secondary interactive elements, links, and informational badges.
- **Success & Error**: Emerald (#10B981) denotes enrollment and completion, while Rose (#F43F5E) is strictly for destructive actions and validation errors.
- **Neutrals**: Surface hierarchy is built using the Slate scale. The base background is the darkest value, with cards and modals stepping up to lighter slate tones to create a clear visual stack.

## Typography

The typography system balances the humanist clarity of **Inter** for prose and navigation with the technical precision of **JetBrains Mono** for administrative data and metadata.

Headlines should utilize tight letter-spacing and heavy weights to anchor page sections. Body copy maintains a generous line height to ensure readability in documentation and event descriptions. Use the mono-spaced label for timestamps, ID strings, and hackathon status tags to provide a distinct "developer-centric" feel to the data-heavy views.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for desktop and a **single-column vertical stack** for mobile. 

- **Desktop**: 1280px max-width container, centered. 24px gutters provide breathing room between data cards.
- **Spacing Rhythm**: All spacing is derived from a 4px base unit. Component internal padding should favor 16px (md) and 24px (lg) increments to maintain a structured, professional appearance.
- **Admin Views**: For dashboard layouts, use a fixed left-rail navigation (240px) and a fluid content area to accommodate expansive data tables.

## Elevation & Depth

In this dark-themed system, depth is achieved through **Tonal Layering** and **Low-Contrast Outlines**.

1.  **Level 0 (Base)**: #0F172A - The main application canvas.
2.  **Level 1 (Cards)**: #1E293B - Used for event listings and primary content blocks. These include a 1px border of #334155 (Slate-700) to define edges.
3.  **Level 2 (Modals/Popovers)**: #334155 - Highest elevation, utilizing a soft, 20% opacity black shadow with a 16px blur to separate the surface from the content below.

Avoid using heavy glows; instead, use Indigo (#6366F1) "ghost" borders (10-20% opacity) to highlight active or focused states.

## Shapes

The shape language is **Soft (0.25rem)**, reflecting a systematic and utilitarian aesthetic. 

- **Standard Elements**: Buttons and input fields use a 4px (0.25rem) radius.
- **Containers**: Large cards and modals use 8px (0.5rem) to soften the layout without appearing overly "bubbly."
- **Interactive States**: Focus rings should follow the corner radius of the parent element exactly, with a 2px offset.

## Components

- **Buttons**: Primary buttons are solid Indigo (#6366F1) with white text. Secondary buttons use a Slate-800 background with a subtle Slate-700 border.
- **Input Fields**: Backgrounds use the deepest slate color with a 1px Slate-700 border. On focus, the border transitions to Indigo with a subtle outer glow.
- **Cards**: Cards are the primary vehicle for hackathon listings. They should feature a 1px border and use the `label-mono` typography for metadata (e.g., "ENDS IN 2D 4H").
- **Chips/Badges**: Small, low-contrast pills. For example, a "Verified" badge would be a 10% opacity Indigo background with Indigo text.
- **Lists**: Use horizontal dividers (#334155) only when necessary; otherwise, use whitespace (16px) to separate list items.
- **Progress Bars**: Used for hackathon timelines or registration caps. These should use a height of 8px with a Secondary Blue fill and a Slate-800 track.