---
name: Intelligent Stillness
colors:
  surface: '#fbf9f3'
  surface-dim: '#dbdad4'
  surface-bright: '#fbf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4ed'
  surface-container: '#efeee7'
  surface-container-high: '#eae8e2'
  surface-container-highest: '#e4e2dc'
  on-surface: '#1b1c18'
  on-surface-variant: '#444748'
  inverse-surface: '#30312d'
  inverse-on-surface: '#f2f1ea'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5b'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0db'
  on-secondary-container: '#62635f'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1f18'
  on-tertiary-container: '#73897f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e3de'
  secondary-fixed-dim: '#c6c7c2'
  on-secondary-fixed: '#1a1c19'
  on-secondary-fixed-variant: '#454744'
  tertiary-fixed: '#d1e8dd'
  tertiary-fixed-dim: '#b5ccc1'
  on-tertiary-fixed: '#0b1f18'
  on-tertiary-fixed-variant: '#374b43'
  background: '#fbf9f3'
  on-background: '#1b1c18'
  surface-variant: '#e4e2dc'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-page: 24px
  gutter-card: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is rooted in the Scandinavian principles of functional minimalism and "Hygge"—creating an environment that feels both intellectually sharp and emotionally warm. It is designed for high-achievers who seek clarity over clutter. 

The aesthetic identity blends **Minimalism** with subtle **Glassmorphism**. It prioritizes generous whitespace to reduce cognitive load, allowing the user's content to breathe. The interface should feel like a premium physical planner—tactile yet digital—evoking a sense of calm, focus, and intentionality. Every transition should be fluid and purposeful, avoiding jarring movements in favor of soft fades and gentle scales.

## Colors

The palette is inspired by natural Nordic materials: stone, wood, and winter light. 

- **Primary:** A deep "Ink Black" (#1A1A1A) used for primary actions and headers to provide a strong anchor.
- **Secondary/Surface:** "Nordic Linen" (#F5F5F0) and "Bone" (#FCFCFA) form the base of the UI, replacing harsh pure whites with a softer, more organic tone.
- **Accents:** 
    - **Sage Green (#8DA399):** Used sparingly for "Complete" states, growth indicators, and habit success.
    - **Soft Blue (#A4B8C4):** Reserved for "Focus" modes, deep work sessions, and calming reminders.
- **Neutral:** Mid-tone grays with a hint of warmth to ensure text remains legible without the high-contrast strain of pure black-on-white.

## Typography

This design system utilizes **Hanken Grotesk** for all roles. It offers a unique balance of geometric precision and humanist warmth, making it highly readable at small sizes while remaining distinctive in large display formats.

- **Hierarchy:** Use tight letter-spacing for headlines to create a "locked-in" professional look.
- **Labels:** Small labels should use increased letter-spacing and semi-bold weights to ensure they are glanceable even in low-contrast scenarios.
- **Contrast:** Secondary information should utilize the Neutral Gray (#70706B) rather than a smaller font size to maintain accessibility.

## Layout & Spacing

The layout philosophy follows a **fluid vertical stack** with generous safe margins. 

- **Grid:** A standard 8px baseline grid ensures alignment.
- **Margins:** A consistent 24px side margin on mobile devices provides a premium, spacious feel that prevents the UI from feeling "cramped."
- **Grouping:** Use the "Stack" principle. Related items (like a task and its sub-tasks) use `stack-sm`. Distinct sections (like Habits vs. Calendar) use `stack-lg` to create clear visual separation without the need for intrusive divider lines.
- **Touch Targets:** All interactive elements maintain a minimum 44x44px hit area, even if the visual asset is smaller.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers** rather than heavy borders.

1.  **Level 0 (Base):** The "Bone" background (#FCFCFA).
2.  **Level 1 (Cards):** Standard "Nordic Linen" surfaces (#F5F5F0) with a very soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.04)).
3.  **Level 2 (Floating/Active):** Elements like the Floating Action Button (FAB) or active cards use a slightly deeper shadow and a 0.5pt subtle inner-stroke to simulate a crisp edge.
4.  **Glassmorphism:** Navigation bars (top and bottom) utilize a 20px backdrop blur with 80% opacity of the background color. This allows the user to maintain a sense of context as they scroll through their day.

## Shapes

The shape language is purposefully **Rounded** to evoke a sense of friendliness and organic flow.

- **Standard Cards:** Use 16px (`rounded-lg`) to 24px (`rounded-xl`) corner radii.
- **Buttons:** Interactive buttons should follow the card radius for a unified appearance. 
- **Icons:** Use thin-stroke (1.5px) linear icons with slightly rounded caps and corners to match the typography's soften edges. Avoid filled icons unless indicating an "active" state.

## Components

- **Modular Cards:** Containers for tasks and calendar events. Use no borders; instead, use a subtle tonal shift from the background. On tap, cards should subtly scale down (98%) to provide tactile feedback.
- **Progress Rings:** Used for habit tracking. Use the Sage Green for the progress fill and a very light version of the same hue for the track. Stroke weight should be "thin" (3-4px) to maintain the minimalist aesthetic.
- **Timeline-based Schedules:** A vertical line (1px width, Soft Gray) with circular nodes. The current time indicator should be a small, solid Ink Black dot with a pulsing Soft Blue aura.
- **Bottom Navigation:** A glassmorphic bar containing 4-5 icons. Labels appear only on the active state to reduce visual noise.
- **Floating Action Button (FAB):** A medium-sized circular button in Ink Black with a white "+" icon. Position it offset from the bottom-right corner by 24px.
- **Input Fields:** Use a single bottom border or a very subtle tonal background. Focus states are indicated by a slight vertical shift or the appearance of a Soft Blue cursor, rather than a bold colored border.