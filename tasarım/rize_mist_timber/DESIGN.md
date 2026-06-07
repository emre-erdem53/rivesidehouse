---
name: Rize Mist & Timber
colors:
  surface: '#f8faf8'
  surface-dim: '#d8dad9'
  surface-bright: '#f8faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f2'
  surface-container: '#eceeec'
  surface-container-high: '#e6e9e7'
  surface-container-highest: '#e1e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#434843'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#eff1ef'
  outline: '#737973'
  outline-variant: '#c3c8c1'
  surface-tint: '#4d6453'
  primary: '#061b0e'
  on-primary: '#ffffff'
  primary-container: '#1b3022'
  on-primary-container: '#819986'
  inverse-primary: '#b4cdb8'
  secondary: '#6c5b4e'
  on-secondary: '#ffffff'
  secondary-container: '#f6decd'
  on-secondary-container: '#726153'
  tertiary: '#06191c'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c2e31'
  on-tertiary-container: '#829699'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e9d4'
  primary-fixed-dim: '#b4cdb8'
  on-primary-fixed: '#0b2013'
  on-primary-fixed-variant: '#364c3c'
  secondary-fixed: '#f6decd'
  secondary-fixed-dim: '#d9c2b2'
  on-secondary-fixed: '#25190f'
  on-secondary-fixed-variant: '#534437'
  tertiary-fixed: '#d2e6ea'
  tertiary-fixed-dim: '#b6cacd'
  on-tertiary-fixed: '#0b1e21'
  on-tertiary-fixed-variant: '#374a4d'
  background: '#f8faf8'
  on-background: '#191c1b'
  surface-variant: '#e1e3e1'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
---

## Brand & Style
This design system is inspired by the rugged, misty landscapes of the Kaçkar Mountains and the lush tea plantations of Rize. The brand personality is **Serene, Luxurious, and Grounded**. It balances the raw, organic beauty of nature with the precision of modern minimalist design. 

The aesthetic follows a **Modern Nature** approach: 
- **Minimalism** provides the structural foundation through heavy whitespace and a focused palette.
- **Glassmorphism** is utilized to replicate the atmospheric "mist" of the Black Sea region, creating depth without clutter.
- **Tactile Elements** are introduced through subtle wood-grain textures and organic layering, evoking the feeling of a premium mountain lodge.

The target audience seeks an escapist yet sophisticated digital experience that feels as quiet and revitalizing as a retreat in a high-altitude plateau.

## Colors
The palette is derived directly from the Rize geography:
- **Forest Green (Primary):** A deep, saturated evergreen used for core branding and primary actions. It represents the dense flora of the region.
- **Earthy Wood (Secondary):** A muted, warm brown used for accents and grounding elements, evoking cedar and chestnut timber.
- **Slate Gray (Tertiary):** A cool, misty gray used for secondary icons and borders, reflecting the stony mountain peaks.
- **Misty White (Neutral):** The canvas of the design system. Not a pure white, but a soft, slightly cool-tinted neutral that reduces eye strain and provides a high-end feel.

The color system relies on high-contrast pairings between the Deep Forest and Misty White to ensure legibility while maintaining a calm atmosphere.

## Typography
The typography strategy creates a tension between tradition and modernity.
- **Headlines:** Uses *EB Garamond*. This sophisticated serif evokes the classic feel of editorial publishing and luxury hospitality. It should be typeset with slightly tighter letter-spacing in larger sizes to feel premium.
- **Body & UI:** Uses *Hanken Grotesk*. A sharp, contemporary sans-serif that provides exceptional readability. Its clean geometry ensures the UI feels efficient and modern.
- **Scale:** Use the `display` sizes for hero sections and chapter titles. Ensure `body-lg` is the default for long-form reading to maintain the "airy" feel of the design system.

## Layout & Spacing
The layout philosophy is **Airy and Unconstrained**, mirroring the vastness of a mountain range. 
- **Grid:** A 12-column fixed grid is preferred for desktop to maintain elegant, centered compositions.
- **Vertical Rhythm:** Generous padding (using `lg` and `xl` tokens) should be used between sections to allow the content to breathe. 
- **Reflow:** On mobile, margins tighten to 20px, and the grid collapses to a single column. Vertical spacing should be reduced by one step (e.g., `xl` becomes `lg`) to keep the experience cohesive on smaller screens.
- **Safe Areas:** Elements should never feel crowded. If in doubt, increase the whitespace.

## Elevation & Depth
Depth is created through **Atmospheric Layering** rather than traditional heavy shadows.
- **Misty Surfaces:** Use semi-transparent white backgrounds (e.g., `rgba(245, 247, 245, 0.7)`) with a high backdrop-blur (12px to 20px). This creates a "frosted glass" effect that mimics mountain fog.
- **Shadows:** When necessary, use very large, ultra-soft shadows with low opacity (3-5%) tinted with the Slate Gray color. This prevents the "dirty" look of pure black shadows.
- **Z-Index Strategy:** The "Mist" layers always sit above the background imagery (like tea leaves or wood textures), creating a sense of physical distance between the UI and the natural elements.

## Shapes
The shape language is **Soft and Organic**. 
- **Standard Corners:** Most UI containers (Cards, Inputs) use the `rounded` (0.5rem) setting.
- **Interactive Elements:** Buttons and Chips should utilize `rounded-lg` (1rem) to feel more inviting and tactile.
- **Iconography:** Use line icons with rounded caps and joins to match the soft-cornered UI.

## Components
- **Buttons:** Primary buttons use the Forest Green background with Misty White text. Secondary buttons are "ghost" style with a Slate Gray border or a frosted glass background.
- **Cards:** Use a subtle wood-grain texture as a background for certain highlight cards, overlaid with a frosted glass pane for the text content. Standard cards should have a thin 1px Slate Gray border at 10% opacity.
- **Inputs:** Fields should be semi-transparent Mist White with a subtle bottom border or a soft-rounded enclosure. Focus states should transition the border to Forest Green.
- **Chips/Tags:** Use Earthy Wood backgrounds at 10% opacity with Secondary color text for a natural, organic look.
- **Lists:** Use generous vertical padding between list items and subtle Slate Gray horizontal dividers that don't span the full width of the container.
- **Specialty Component - "The Fog Overlay":** A full-screen or partial-screen transition component that uses a gradient blur to reveal content, mimicking a cloud passing through a valley.