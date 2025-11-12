# AuthorStack Landing Page Redesign

## Overview
This document outlines the comprehensive redesign of the AuthorStack landing page, implementing a "digital writing studio" theme with literary aesthetics tailored for indie authors.

## Changes Made

### 1. New Components Created

#### `components/landing/Hero.tsx`
- Hero section with animated background elements (floating pages, ink blots)
- Main heading: "Turn your author journey into a well-oiled publishing engine."
- Subheading with literary tone
- CTA buttons with hover animations
- SVG illustration showing desk-to-dashboard transformation
- Framer Motion animations with reduced-motion support

#### `components/landing/FeatureCard.tsx`
- Reusable feature card component with hover effects
- Icon with tilt animation on hover
- Torn paper effect border (SVG)
- Ink blot fade effect on hover
- Staggered animations for card appearance

#### `components/landing/PricingCard.tsx`
- Three pricing tiers (Free, Pro, Enterprise)
- Animated ribbon badge for "Most Popular"
- Feature list with staggered animations
- Hover float effect
- Decorative corner marks

#### `components/landing/Features.tsx`
- Grid layout of 4 feature cards
- Wave-shaped section dividers
- Staggered container animations
- Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)

#### `components/landing/Pricing.tsx`
- Three-column pricing layout
- Animated section header
- Wave dividers
- Responsive grid

#### `components/landing/SectionDivider.tsx`
- Reusable section divider component
- Three variants: wave, torn, line
- SVG-based for crisp rendering
- Animated line variant with scaleX animation

#### `components/landing/FinalCTA.tsx`
- Deep burgundy background section
- Animated background pages (looping)
- Strong call-to-action
- Trust indicators

### 2. Animation Library

#### `lib/animations.ts`
Centralized animation definitions using Framer Motion variants:
- `fadeInUp` - Fade in with upward movement
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `staggerContainer` - Container for staggered children
- `scaleIn` - Scale animation
- `floatingAnimation` - Continuous floating effect
- `tiltHover` - 3D tilt on hover
- `underlineAnimation` - Animated underline

All animations include `prefers-reduced-motion` support through Framer Motion's built-in accessibility.

### 3. Updated Main Page

#### `app/page.tsx` → `app/page-new.tsx`
- Imports new landing components
- Maintains existing navigation
- Adds footer with links
- Semantic HTML structure (main, section, footer)
- Metadata for SEO

### 4. Dependencies

Added to `package.json`:
- `framer-motion@^10.16.16` - For smooth animations

Install with:
```bash
pnpm install
```

## Design System

### Color Palette
- **Burgundy**: `#8A1B2E` - Primary accent, literary feel
- **Ink**: `#11110F` - Near-black for text
- **Charcoal**: `#3C3B39` - Secondary text
- **Paper**: `#FAF7F1` - Off-white background
- **Surface**: `#FFFFFF` - Card backgrounds
- **Forest**: `#1F6F4F` - Success/positive actions

### Typography
- **Headings**: Merriweather (serif) - Literary, authoritative
- **Body**: Inter (sans-serif) - Clean, readable
- **Mono**: JetBrains Mono - Code/data

### Spacing & Sizing
- Uses Tailwind's default scale
- Custom border radius: `card: 8px`, `modal: 12px`
- Custom shadows: `elevated: 0 6px 18px rgba(17,17,15,0.06)`

## Customization Guide

### Change Primary Color
Edit `tailwind.config.ts`:
```typescript
burgundy: '#YOUR_COLOR_HERE',
```

Then update component references from `text-burgundy`, `bg-burgundy`, etc.

### Modify Animation Speed
Edit `lib/animations.ts`:
```typescript
transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }
//                      ↑ Change this value (in seconds)
```

### Add/Remove Features
Edit `components/landing/Features.tsx`:
```typescript
const features = [
  // Add/remove objects here
];
```

### Update Copy
All text is in component files:
- Hero copy: `components/landing/Hero.tsx`
- Feature titles/descriptions: `components/landing/Features.tsx`
- Pricing plans: `components/landing/Pricing.tsx`
- Final CTA: `components/landing/FinalCTA.tsx`

## Running the Project

### Development
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
pnpm build
pnpm start
```

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with responsive design

## Accessibility Features
- Semantic HTML (main, section, footer, nav)
- Framer Motion respects `prefers-reduced-motion`
- Color contrast meets WCAG AA standards
- Keyboard navigation support
- Alt text for SVG illustrations (can be added)

## Performance Considerations
- SVG illustrations are inline (no external requests)
- Framer Motion uses GPU acceleration for smooth animations
- Images optimized with Next.js Image component (when added)
- CSS animations use transform/opacity (GPU-friendly)

## Future Enhancements
1. Add actual images/screenshots to hero illustration
2. Implement testimonials section
3. Add FAQ section
4. Integrate analytics tracking
5. Add form validation for CTA
6. Implement dark mode variant

## File Structure
```
components/
├── landing/
│   ├── Hero.tsx
│   ├── FeatureCard.tsx
│   ├── Features.tsx
│   ├── PricingCard.tsx
│   ├── Pricing.tsx
│   ├── SectionDivider.tsx
│   └── FinalCTA.tsx
lib/
├── animations.ts
app/
├── page-new.tsx (rename to page.tsx when ready)
```

## Notes
- The old `app/page.tsx` is preserved as backup
- To activate the new design, rename `page-new.tsx` to `page.tsx`
- All components are client-side rendered (use 'use client' directive)
- Tailwind classes handle all styling (no external CSS files)
