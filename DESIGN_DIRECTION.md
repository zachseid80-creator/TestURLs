# BioStrip Website Rebuild - Design Direction

## Executive Summary
Modern, dark-themed premium peptide supplement website with glassmorphism accents, subtle molecular animations, and performance-focused interactions.

---

## 1. Design Direction

### Theme: Dark Mode (Premium Science Aesthetic)

**Rationale:**
- Peptide supplements demand trust, precision, and scientific credibility
- Dark mode conveys premium, clinical-grade quality (like GL Peptides branding)
- Differentiates from generic supplement sites that use light themes
- Better showcases product imagery with proper contrast

### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background (Deep) | Obsidian | `#0a0a0f` |
| Background (Surface) | Carbon | `#12121a` |
| Primary Accent | Bio Teal | `#0d9488` (keep from original) |
| Secondary | Molecular Blue | `#3b82f6` |
| Tertiary | Recovery Gold | `#f59e0b` |
| Text Primary | Off-White | `#f4f4f5` |
| Text Secondary | Zinc | `#a1a1aa` |
| Border | Graphite | `#27272a` |

**Gradient accents:**
- Teal → Blue gradient for CTAs and highlights
- Subtle radial gradients on hero for depth (no harsh edges)

### Typography

- **Headings:** "Instrument Serif" (elegant, distinctive, premium)
- **Body:** "DM Sans" (already loaded - clean, readable)
- **Mono/Labels:** "JetBrains Mono" for stats and technical specs

### Visual Style: Glassmorphism + Molecular

- **Glassmorphism:** Navbar, product cards, modal with backdrop-blur(12px) and subtle borders
- **Molecular patterns:** Subtle dot grid or orbital line patterns in backgrounds (opacity 0.03-0.05)
- **Glow effects:** Soft teal glow behind key elements (box-shadow with accent color)

---

## 2. Key Animations (Framer Motion)

### Hero Section
- **Entrance:** Staggered fade-up (title → subtitle → CTA) with 0.1s delays
- **Floating particles:** Subtle floating molecular dots (3-5) drifting upward continuously
- **CTA button:** Scale on hover (1.02), subtle glow pulse

### Product Cards
- **Entrance:** Fade-up with stagger (0.08s between cards)
- **Hover:** 
  - Card lifts (translateY -8px)
  - Border glow (accent color at 30% opacity)
  - Image subtle zoom (scale 1.05)
  - "View Details" button fades in
- **Tap feedback:** Scale down briefly (0.98)

### Scroll Reveals (use `whileInView`)
- **Sections:** Fade-up with 200ms duration
- **Stats counter:** Count up animation (0 → 99%, etc.)
- **Features:** Stagger reveal with icon pulse on view

### Modal
- **Open:** Scale from 0.95 + fade (300ms ease-out)
- **Close:** Scale to 0.95 + fade out (200ms)
- **Backdrop:** Fade in (200ms)

### Page Transitions
- **Between sections:** Smooth scroll behavior
- **On load:** No full-page transition (just element reveals)

---

## 3. Component Suggestions

### Navbar (Sticky)
- Glassmorphism effect (backdrop-blur)
- Logo left, nav links center, CTA right
- Shrinks slightly on scroll (64px → 56px)
- Mobile: hamburger → slide-in drawer

### Hero Section
- Full viewport height (min-h-screen)
- Large serif headline with accent word highlighted
- Subheadline with max-width ~600px
- Dual CTAs: "Shop Now" (primary) + "Learn How It Works" (secondary/ghost)
- Animated molecular background (CSS or canvas)
- Scroll indicator at bottom

### Products Grid
- 3-column grid (desktop), 2-col (tablet), 1-col (mobile)
- Product cards with:
  - Tag pill (top-left)
  - Product image (16:9 aspect)
  - Title (serif)
  - Flavor line
  - Short description (2 lines max)
  - Price
  - "View Details" button (appears on hover)
- Click opens modal with full details

### About Section
- Split layout: text left, stats right
- Stats with animated counters:
  - "99% Bioavailability"
  - "30s Time to Dissolve"
  - "0 Needles Required"
- Subtle background pattern

### Features Grid
- 4-column (desktop), 2-col (tablet)
- Each feature:
  - Icon in circular container (glass effect)
  - Title
  - Short description
- Hover: icon pulse + slight lift

### Newsletter
- Centered section with gradient border
- Email input + submit button inline (desktop), stacked (mobile)
- Success state: checkmark animation

### Footer
- Minimal: copyright + social links
- Glassmorphism top border

### Product Modal
- Full details: large image, full description, feature list, disclaimer
- "Add to Cart" button
- Close via X button, overlay click, or Escape key

---

## 4. Technical Approach

### Tech Stack
- **Framework:** Next.js 14 (App Router) or React + Vite
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Components:** 21st.dev Magic (or custom with shadcn/ui patterns)
- **Icons:** Lucide React (clean, consistent)

### Key Libraries
```bash
npm install framer-motion next tailwindcss lucide-react
# Optional for 21st.dev components:
npm install @21st-century/react-components  # or similar
```

### File Structure
```
biostrip/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Products.tsx
│   ├── ProductCard.tsx
│   ├── ProductModal.tsx
│   ├── About.tsx
│   ├── Features.tsx
│   ├── Newsletter.tsx
│   └── Footer.tsx
├── lib/
│   └── products.ts  # product data
└── public/
    └── images/
```

### Animation Implementation Notes

1. **Framer Motion setup:**
   ```tsx
   import { motion } from 'framer-motion'
   
   // Variants for reusable animations
   const fadeUp = {
     initial: { opacity: 0, y: 20 },
     animate: { opacity: 1, y: 0 },
     transition: { duration: 0.5, ease: 'easeOut' }
   }
   
   const staggerContainer = {
     animate: { transition: { staggerChildren: 0.1 } }
   }
   ```

2. **Scroll animations:**
   ```tsx
   <motion.div
     initial={{ opacity: 0, y: 30 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true, margin: '-100px' }}
     transition={{ duration: 0.6 }}
   >
   ```

3. **Respect reduced motion:**
   ```tsx
   const shouldReduceMotion = useReducedMotion()
   // Use shorter durations or disable complex animations
   ```

4. **Performance:**
   - Use `transform` and `opacity` only (avoid animating width/height)
   - Lazy load below-fold components
   - Use `will-change: transform` sparingly on animated elements

---

## 5. Implementation Priority

### Phase 1: Core (MVP)
1. Project setup (Next.js + Tailwind)
2. Navbar + Hero with entrance animations
3. Products grid with hover effects
4. Basic modal for product details

### Phase 2: Polish
5. About section with stat counters
6. Features grid
7. Newsletter form
8. Footer
9. Scroll-triggered reveals throughout

### Phase 3: Refinement
10. Mobile responsiveness
11. Reduced motion support
12. Performance optimization
13. Micro-interactions (button hovers, focus states)

---

## 6. Key Differentiators from Current Site

| Current | New |
|---------|-----|
| Light theme | Dark premium theme |
| Basic CSS animations | Framer Motion complex animations |
| Static product cards | Interactive cards with hover/click states |
| Simple modal | Animated modal with full details |
| No scroll effects | Scroll-triggered reveals |
| Generic feel | Science-forward, premium aesthetic |

---

*This design direction balances scientific credibility with modern premium appeal—appropriate for a practitioner-grade peptide supplement brand.*