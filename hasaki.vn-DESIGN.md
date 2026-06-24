# Design System Inspired by Hasaki.vn

## 1. Visual Theme & Atmosphere

Hasaki.vn's design system embodies a fresh, accessible, and commerce-driven aesthetic that balances premium beauty retail with approachable everyday shopping. The visual identity combines natural greens and warm oranges to evoke wellness, trust, and energy—reflecting the brand's positioning as a comprehensive beauty and clinic marketplace. The design prioritizes clarity and scannability through crisp typography, generous whitespace, and vibrant accent colors that guide user attention to deals and key actions. The overall mood is modern, friendly, and results-oriented, with an emphasis on promotional messaging and rapid product discovery.

**Key Characteristics**
- **Vibrant accent system** using warm orange (#FF6600) paired with natural forest green (#306E51) to create urgency and trust
- **High-contrast, clean typography** with generous line heights for easy scanning on mobile and desktop
- **Abundant whitespace** around product cards and promotional sections to reduce cognitive load
- **Deal-focused visual hierarchy** using bold pricing displays and countdown timers as focal points
- **Accessible neutral palette** (#333333, #FFFFFF, #CCCCCC) that ensures legibility across backgrounds
- **Warm, approachable tone** balancing professional beauty retail with friendly e-commerce energy

## 2. Color Palette & Roles

### Primary
- **Primary Green** (`#306E51`): Primary brand color for trusted CTAs, headers, navigation accents, and wellness messaging
- **Secondary Green** (`#326E51`): Slight variant for subtle interactive depth and focus states on primary elements

### Accent Colors
- **Warm Orange** (`#FF6600`): High-energy accent for flash deals, promotional banners, and attention-grabbing CTAs
- **Soft Peach** (`#FFAF7E`): Lighthearted accent for promotional backgrounds and secondary promotional zones
- **Hot Pink** (`#FF235C`): Alert/urgent accent for limited-time or critical promotional messaging

### Interactive
- **Success Green** (`#059852`): Confirmation states, success messages, and positive transaction indicators
- **Success Green Alt** (`#25BC4F`): Secondary success state for approved actions and positive feedback

### Neutral Scale
- **Charcoal** (`#09090B`): Primary text color; used throughout for headings, body text, and high-contrast elements
- **Dark Gray** (`#333333`): Secondary text, supporting copy, and secondary navigation
- **Medium Gray** (`#787878`): Tertiary text, disabled states, and metadata
- **Light Gray** (`#CCCCCC`): Borders, dividers, and subtle background tints
- **Lighter Gray** (`#DDDDDD`): Subtle separator lines and very light borders
- **Off-White** (`#F1F1F5`): Soft background for secondary sections and gentle contrast

### Surface & Borders
- **White** (`#FFFFFF`): Primary surface for cards, inputs, and main content areas
- **Light Border** (`#CCCCCC`): Default border stroke for inputs, cards, and segmentation
- **Dark Border** (`#777777`): Secondary borders for less prominent divisions

### Semantic / Status
- **Transparent Black** (`#0000`): Overlay and modal darkening for focus
- **Pure Black** (`#000000`): Extreme contrast fallback for critical messaging
- **Light Mint** (`#CFEADD`): Subtle background tint for positive or informational zones

## 3. Typography Rules

### Font Family
**Primary:** Inter (`__Inter_f367f3`), sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|-----------------|-------|
| Display / H1 | Inter | 32px | 700 | 40px | 0px | Hero headers, major page titles |
| Heading / H2 | Inter | 24px | 700 | 32px | 0px | Section headers, category titles |
| Subheading / H3 | Inter | 14px | 400 | 20px | 0px | Subsection headers, card titles |
| Label / H4 | Inter | 14px | 700 | 20px | 0px | Form labels, emphasis text, small headers |
| Body Standard | Inter | 12px | 400 | 16px | 0px | Default paragraph text, descriptions |
| Body Large | Inter | 16px | 400 | 24px | 0px | Feature text, prominent body copy |
| Button / CTA | Inter | 12px | 500 | 16px | 0px | Button text, primary actions |
| Button Large | Inter | 14px | 500 | 20px | 0px | Large button text, prominent CTAs |
| Caption / Small | Inter | 11px | 400 | 14px | 0px | Help text, secondary metadata, fine print |
| Code / Monospace | Inter | 12px | 500 | 16px | 0px | Technical text, discount codes |

### Principles
- **Hierarchy-driven:** Weight and size create clear visual rhythm; always pair weight increase with size increase
- **Mobile-first scaling:** Base sizes (12px body, 14px label) optimize for touch readability; scale up to 16px on desktop for featured content
- **Line height consistency:** Generous line heights (1.33–1.5 ratio) ensure readability on mobile and support quick scanning
- **Weight restraint:** Limited palette (400, 500, 700) prevents font bloat; use 700 only for emphasis (headers, labels, buttons)
- **Accessibility:** Minimum body size is 12px; inputs and buttons use 14px minimum for touch targets

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** `#306E51`
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Padding:** `12px 24px`
- **Border Radius:** `6px`
- **Border:** `0px solid transparent`
- **Line Height:** `20px`
- **Height:** `40px`
- **Box Shadow:** `rgba(20, 25, 26, 0.08) 0px 4px 16px 0px`
- **Hover State:** Background `#276244`, shadow intensity +10%
- **Active State:** Background `#1f5238`, shadow intensity +15%
- **Disabled State:** Background `#CCCCCC`, text `#787878`, no shadow

#### Secondary Button (Orange)
- **Background:** `#FF6600`
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Padding:** `12px 24px`
- **Border Radius:** `6px`
- **Border:** `0px solid transparent`
- **Line Height:** `20px`
- **Height:** `40px`
- **Box Shadow:** `rgba(20, 25, 26, 0.08) 0px 4px 16px 0px`
- **Hover State:** Background `#E55A00`, shadow intensity +10%
- **Active State:** Background `#D65200`, shadow intensity +15%

#### Ghost Button
- **Background:** `transparent`
- **Text Color:** `#306E51`
- **Font Size:** `12px`
- **Font Weight:** `500`
- **Padding:** `8px 16px`
- **Border Radius:** `6px`
- **Border:** `1px solid #306E51`
- **Line Height:** `16px`
- **Height:** `36px`
- **Box Shadow:** `none`
- **Hover State:** Background `#CFEADD`, border `#306E51`
- **Active State:** Background `#B5E0D1`, text `#1f5238`

#### Button (Minimal)
- **Background:** `transparent`
- **Text Color:** `#306E51`
- **Font Size:** `12px`
- **Font Weight:** `500`
- **Padding:** `8px 12px`
- **Border Radius:** `0px`
- **Border:** `0px solid transparent`
- **Line Height:** `16px`
- **Height:** `36px`
- **Box Shadow:** `none`
- **Hover State:** Text `#276244`, underline `1px solid #306E51`
- **Active State:** Text `#1f5238`

### Cards & Containers

#### Product Card
- **Background:** `#FFFFFF`
- **Text Color:** `#09090B`
- **Border Radius:** `12px`
- **Border:** `0px solid transparent`
- **Padding:** `0px`
- **Box Shadow:** `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(20, 25, 26, 0.04) 0px 2px 8px 0px`
- **Hover State:** Box shadow `rgba(20, 25, 26, 0.08) 0px 4px 16px 0px`, background `#F9FAFB`
- **Width:** `205px` (mobile), `220px` (tablet), `240px` (desktop)
- **Font Size (Body):** `16px`
- **Font Weight (Body):** `400`
- **Line Height (Body):** `24px`

#### Promotional Banner Card
- **Background:** Linear gradient `#306E51` to `#1f5238`
- **Text Color:** `#FFFFFF`
- **Border Radius:** `12px`
- **Padding:** `24px 32px`
- **Box Shadow:** `rgba(20, 25, 26, 0.12) 0px 8px 24px 0px`
- **Border:** `0px solid transparent`
- **Font Size:** `16px–24px`
- **Font Weight:** `400–700`
- **Line Height:** `24px–32px`

#### Deal Badge (Orange)
- **Background:** `#FF6600`
- **Text Color:** `#FFFFFF`
- **Padding:** `6px 12px`
- **Border Radius:** `4px`
- **Font Size:** `12px`
- **Font Weight:** `700`
- **Line Height:** `16px`

### Inputs & Forms

#### Text Input
- **Background:** `#FFFFFF`
- **Text Color:** `#333333`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Padding:** `10px 20px`
- **Border Radius:** `19px` (left pill) / `10px` (right side)
- **Border:** `1px solid #CCCCCC`
- **Line Height:** `20px`
- **Height:** `38px`
- **Box Shadow:** `none` (default), `rgba(48, 110, 81, 0.12) 0px 0px 0px 4px` (focus)
- **Placeholder Color:** `#787878`
- **Hover State:** Border `#999999`
- **Focus State:** Border `#306E51`, box shadow active

#### Search Input (Large)
- **Background:** `#FFFFFF`
- **Text Color:** `#333333`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Padding:** `12px 24px`
- **Border Radius:** `24px`
- **Border:** `1px solid #CCCCCC`
- **Line Height:** `20px`
- **Height:** `44px`
- **Icon Color:** `#787878`
- **Focus State:** Border `#306E51`, background `#F9FAFB`

#### Checkbox
- **Width / Height:** `16px`
- **Border Radius:** `4px`
- **Border:** `1px solid #CCCCCC`
- **Background (Unchecked):** `#FFFFFF`
- **Background (Checked):** `#306E51`
- **Checkmark Color:** `#FFFFFF`
- **Focus State:** Border `#306E51`, outline `2px solid rgba(48, 110, 81, 0.2)`

### Navigation

#### Top Navigation Bar
- **Background:** `#306E51`
- **Height:** `64px`
- **Padding:** `12px 24px`
- **Text Color:** `#FFFFFF`
- **Font Size:** `16px`
- **Font Weight:** `500`
- **Line Height:** `24px`
- **Box Shadow:** `rgba(20, 25, 26, 0.08) 0px 2px 8px 0px`

#### Navigation Link (Desktop)
- **Text Color:** `#333333`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Padding:** `8px 16px`
- **Border Radius:** `0px`
- **Line Height:** `20px`
- **Hover State:** Text `#306E51`, underline `2px solid #FF6600` (accent)
- **Active State:** Text `#306E51`, border-bottom `3px solid #306E51`

#### Breadcrumb
- **Text Color:** `#787878`
- **Font Size:** `12px`
- **Font Weight:** `400`
- **Separator:** `>` in `#CCCCCC`
- **Active Link:** Color `#09090B`, weight `500`
- **Hover State:** Color `#306E51`

### Badges & Tags

#### Success Badge
- **Background:** `#059852`
- **Text Color:** `#FFFFFF`
- **Padding:** `4px 8px`
- **Border Radius:** `4px`
- **Font Size:** `11px`
- **Font Weight:** `500`
- **Line Height:** `14px`

#### Sale Badge
- **Background:** `#FF6600`
- **Text Color:** `#FFFFFF`
- **Padding:** `6px 12px`
- **Border Radius:** `4px`
- **Font Size:** `12px`
- **Font Weight:** `700`
- **Line Height:** `16px`

### Tabs

#### Tab (Default)
- **Background:** `transparent`
- **Text Color:** `#333333`
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Padding:** `12px 20px`
- **Border Radius:** `0px`
- **Border Bottom:** `2px solid transparent`
- **Line Height:** `20px`
- **Hover State:** Color `#306E51`, border-bottom `2px solid #CCCCCC`

#### Tab (Active)
- **Background:** `transparent`
- **Text Color:** `#306E51`
- **Border Bottom:** `2px solid #306E51`
- **Font Weight:** `600`

## 5. Layout Principles

### Spacing System

**Base Unit:** `4px`

**Spacing Scale:**
- `4px`: Ultra-tight (icon spacing, badge padding)
- `8px`: Tight (button padding, list gaps)
- `12px`: Compact (component gaps, small section spacing)
- `16px`: Comfortable (padding, standard gaps)
- `20px`: Generous (margin between sections)
- `24px`: Spacious (gap between major content blocks)
- `32px`: Wide (padding in large containers, section separation)
- `64px`: Extra wide (top/bottom padding on hero sections, page margins)

**Context Usage:**
- **Component Internal Padding:** `8px–16px` (buttons, inputs, cards)
- **Gap Between Components:** `12px–20px` (lists, grid items)
- **Section Margins:** `24px–32px` (spacing between major sections)
- **Page Margins:** `20px–64px` (top, bottom, left, right on full-width sections)

### Grid & Container

**Max Width:** `1440px` (full desktop), centered with auto margins

**Column Strategy:**
- **Mobile (< 600px):** Single column, `16px` side padding
- **Tablet (600px–1024px):** 2–3 column grid, `20px` side padding, `12px` gap
- **Desktop (> 1024px):** 4–6 column grid, `24px–32px` side padding, `16px` gap

**Product Grid:**
- **Mobile:** 2 columns × 2 rows, `8px` gap
- **Tablet:** 3 columns, `12px` gap
- **Desktop:** 4–6 columns, `16px` gap

### Whitespace Philosophy

Hasaki.vn uses generous whitespace to reduce cognitive load and highlight promotional messaging. Cards are surrounded by breathing room (minimum `12px` margin), and section boundaries are defined by `24px–32px` vertical spacing rather than borders. Navigation sections feature `16px` padding and `12px` gaps between items to prevent visual cramping. Promotional banners and flash deals are isolated with double whitespace (`32px`) to emphasize urgency without overwhelming the layout.

### Border Radius Scale

- `0px`: Navigation tabs, breadcrumbs, links (no rounding)
- `4px`: Deal badges, small tags, secondary badges
- `6px`: Primary buttons, secondary buttons, ghost buttons, input fields (optional)
- `10px`: Card borders (subtle rounding)
- `12px`: Product cards, promotional cards, modal containers (primary component rounding)
- `19px`: Pill-shaped inputs (search bar left edge)
- `9999px`: Full pill buttons (utility toggle, minimal actions)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | `box-shadow: none` | Text links, minimal buttons, navigation items |
| Raised (Subtle) | `box-shadow: rgba(20, 25, 26, 0.04) 0px 2px 8px 0px` | Product cards, form inputs (default) |
| Elevated (Standard) | `box-shadow: rgba(20, 25, 26, 0.08) 0px 4px 16px 0px` | Cards on hover, primary buttons, modals |
| Floating (High) | `box-shadow: rgba(20, 25, 26, 0.12) 0px 8px 24px 0px` | Promotional banners, full-height overlays, floating CTAs |
| Focus Ring | `box-shadow: rgba(48, 110, 81, 0.2) 0px 0px 0px 4px` (outline only, no lift) | Input focus states, keyboard navigation |

**Shadow Philosophy:**

Hasaki.vn employs subtle, directional shadows that suggest depth without obscuring content. Shadows increase in intensity and blur radius as elevation increases, creating a clear visual hierarchy. The primary shadow color is `rgba(20, 25, 26, ...)`, a soft black that works on light and medium backgrounds. Promotional content and high-priority zones use stronger shadows (`0.12` opacity) to command attention. Focus states use a tinted ring (`#306E51` at 20% opacity) rather than a full shadow to guide keyboard navigation without creating false depth.

## 7. Do's and Don'ts

### Do

- **Use the green primary (#306E51) for trust-building CTAs** (login, account actions, secure checkout)
- **Reserve orange (#FF6600) exclusively for promotional, time-limited, or deal-focused messaging** to create urgency without diluting the primary brand voice
- **Maintain minimum `12px` font size** for all body text to ensure mobile readability
- **Apply subtle shadows (`0.04`–`0.08` opacity) to cards** to suggest interactivity without creating excessive depth
- **Group related product cards in `2–4 column layouts`** with consistent `12px–16px` gaps
- **Use `#CCCCCC` borders for form inputs and dividers** to maintain visual lightness while ensuring visibility
- **Include `24px–32px` whitespace around promotional sections** to separate high-priority messaging from secondary content
- **Scale button padding to `12px 24px` for desktop, `8px 16px` for mobile** to maintain touch-friendly sizing
- **Apply green tint (#CFEADD) backgrounds to success or positive-action zones** for subtle, accessible communication
- **Pair deal badges (orange) with countdown timers** to reinforce urgency in flash sales

### Don't

- **Mix green and orange in the same CTA or button** — assign semantic roles consistently (green for trust/primary, orange for urgency/deals)
- **Use shadows exceeding `0.12` opacity** except in modal overlays, which risk obscuring content and creating harsh contrast
- **Reduce padding below `8px` on buttons or `10px` on inputs** — this compromises touch targets and accessibility
- **Stack multiple cards without `12px` minimum gap** — cramped layouts reduce scannability and feel cluttered
- **Use font sizes below `12px` for body text** or below `11px` for captions, even on mobile
- **Apply heavy borders (`2px+`) to cards or product containers** — Hasaki.vn's cards are defined by shadow and spacing, not strokes
- **Place text directly on orange backgrounds without adequate contrast** — always use white text and test WCAG AA compliance
- **Mix rounded and sharp corners in the same component family** (e.g., all buttons should use `6px`, not mix `0px` and `12px`)
- **Extend whitespace below `8px` between inline elements** — list items, form fields, and navigation links need `8px–12px` minimum gaps
- **Deploy discount badges, countdown timers, or urgent messaging outside of promotional or flash sale contexts** — overuse erodes trust and creates alarm fatigue

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | `< 600px` | Single-column layout, `16px` side padding, `2-column` product grid, `12px` gaps, stacked navigation, `8px 16px` button padding |
| Tablet | `600px–1024px` | `20px` side padding, `2–3 column` product grid, `12px` component gaps, collapsible navigation, full-width inputs, `10px 20px` button padding |
| Desktop | `> 1024px` | `24px–32px` side padding, `4–6 column` product grid, `16px` gaps, horizontal navigation, sidebar layouts, `12px 24px` button padding |

### Touch Targets

- **Minimum button height:** `40px` (interactive areas)
- **Minimum input height:** `38px`
- **Minimum touch area (padding + content):** `44px × 44px` (icon buttons, close buttons)
- **Minimum link padding:** `8px 12px` (ensures 40px+ tappable area when combined)
- **Spacing between touch targets:** `8px` minimum (prevents accidental taps)
- **Card clickable area:** Full card at `16px` padding with hover state feedback

### Collapsing Strategy

**Mobile Adaptation:**
1. **Navigation:** Full-width horizontal scroll or collapse into hamburger menu; use `12px` padding, `14px` font
2. **Product Grids:** Collapse from 4 columns to 2 columns; reduce card width to `160px–180px`, maintain `8px` gap
3. **Form Fields:** Full width with `100%` max-width, `10px 16px` padding, `38px` height
4. **Modals:** Full-screen on mobile (` < 600px`) with `12px` top/bottom padding; desktop centered with `max-width: 600px`
5. **Promotional Banners:** Stack vertically; use smaller typography (`16px` heading, `12px` body); maintain `24px` padding
6. **Images:** Lazy-load below fold; use `1x` resolution on mobile (< 180KB per image), `2x` on tablet (< 300KB), `2–3x` on desktop
7. **Section Spacing:** Reduce from `32px` to `20px` vertical margin; maintain `16px` horizontal padding
8. **Buttons:** Full width on mobile modals (remove fixed width constraints); center align on forms

**Tablet Adaptation:**
1. **Grids:** Transition from 2 columns (mobile) to 3 columns; maintain `12px` gap
2. **Sidebars:** Show collapsed sidebar on left (120px) or hide on portrait; full reveal in landscape
3. **Card Details:** Increase from `205px` to `220px` width; add `16px` padding inside
4. **Typography:** Scale headings up to `20px` (H3), maintain `14px` body

**Desktop Features:**
1. **Hover States:** Reveal add-to-cart button on product hover; show pricing tooltips
2. **Mega Menu:** Horizontal navigation with category flyouts at `300px` width; `16px` padding, `8px` item gap
3. **Sidebar Filters:** Show on left; sticky positioning at viewport top
4. **Product Lightbox:** Full-screen image zoom with `2–3x` DPI; maintain aspect ratio
5. **Lazy Loading:** Defer below-fold images; load adjacent products in carousel on scroll

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA / Trust Actions:** Primary Green (`#306E51`)
- **Promotional / Urgent CTAs:** Warm Orange (`#FF6600`)
- **Success Confirmation:** Success Green (`#059852`)
- **Primary Text / Headings:** Charcoal (`#09090B`)
- **Secondary Text / Metadata:** Dark Gray (`#333333`)
- **Borders / Dividers:** Light Gray (`#CCCCCC`)
- **Card Backgrounds:** White (`#FFFFFF`)
- **Page Background:** Off-White (`#F1F1F5`) or White (`#FFFFFF`)
- **Soft Promotional Tint:** Light Mint (`#CFEADD`)
- **Alert / Limited Time:** Hot Pink (`#FF235C`)

### Iteration Guide

1. **Always use `#306E51` (Primary Green) for account, checkout, and trust-based CTAs.** Use `#FF6600` (Warm Orange) only for time-limited deals, flash sales, and promotional messaging.

2. **Enforce `40px` minimum height on all interactive elements** (buttons, inputs, clickable cards). Use `12px 24px` padding on desktop buttons; scale down to `8px 16px` on mobile. Never reduce below `36px` height.

3. **Apply `12px` minimum body text size** (`14px` for labels, `16px` for feature text). Use generous line heights: `1.33–1.5` ratio (e.g., `16px` text with `24px` line height). Never kern or reduce spacing to compensate for small type.

4. **Isolate product cards with `12px–16px` gaps and subtle shadows (`rgba(20, 25, 26, 0.04) 0px 2px 8px 0px` default).** On hover, elevate to `0.08` opacity shadow. Never stack cards without gaps; never use heavy borders (`> 1px`).

5. **Use rounded corners consistently: `6px` for buttons and inputs, `12px` for card containers, `0px` for navigation elements.** Avoid mixing radii within the same component family.

6. **Maintain `20px–32px` whitespace between major sections** (hero, product grid, footer). Use `8px–12px` gaps for inline elements (form fields, list items, navigation links). Never reduce spacing below `8px` except for icon padding.

7. **Apply `#CCCCCC` borders to inputs and dividers;** use focus-state rings (`rgba(48, 110, 81, 0.2) 0px 0px 0px 4px`) for keyboard navigation. Never remove focus indicators.

8. **Scale typography hierarchically: H2 at `24px 700`, H3 at `14px 400`, body at `12px 400`, buttons at `12px 500`.** Use weight increases sparingly (400 or 500 for body, 700 only for headers/emphasis). Never exceed 3 weights in a single layout.

9. **For promotional content, use orange backgrounds (`#FF6600`) with white text (`#FFFFFF`), or white backgrounds with orange badges (`#FF6600`).** Pair deal messaging with countdown timers and urgency language (limited time, flash sale, exclusive).

10. **On mobile (< 600px), collapse multi-column grids to 2 columns, stack navigation horizontally or into a menu, use full-width inputs (`100%`), and apply `16px` side padding.** On tablet, expand to 3 columns with `20px` padding. On desktop, use 4–6 columns with `24px–32px` padding and reveal hover states.