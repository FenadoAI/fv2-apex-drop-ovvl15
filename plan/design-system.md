# Design System - Luxury Sneaker E-Commerce

## Theme Configuration

**Custom Luxury Theme**
- **Theme ID**: luxury-sneaker
- **Description**: Opulent, bold, and premium aesthetic for sneaker enthusiasts
- **Industry**: High-end fashion e-commerce, sneaker culture

### Light Mode Colors
- **Background**: hsl(0, 0%, 98%) - Very light gray for clean canvas
- **Card**: hsl(0, 0%, 100%) - Pure white for product cards
- **Primary**: hsl(45, 100%, 53%) - Rich gold (#D4AF37) for CTAs and accents
- **Secondary**: hsl(0, 100%, 27%) - Deep red (#8B0000) for urgency and drops
- **Accent**: hsl(0, 0%, 0%) - Pure black (#000000) for bold statements
- **Text**: hsl(0, 0%, 5%) - Near black for primary content
- **Text Muted**: hsl(0, 0%, 40%) - Medium gray for secondary text
- **Border**: hsl(0, 0%, 15%) - Dark gray for subtle separation
- **Muted**: hsl(0, 0%, 96%) - Very light gray for backgrounds

### Dark Mode Colors
- **Background**: hsl(0, 0%, 5%) - Deep black for premium feel
- **Card**: hsl(0, 0%, 8%) - Dark charcoal for elevated surfaces
- **Primary**: hsl(45, 100%, 53%) - Rich gold (#D4AF37) maintains presence
- **Secondary**: hsl(0, 100%, 35%) - Brighter deep red for visibility
- **Accent**: hsl(0, 0%, 100%) - Pure white for contrast
- **Text**: hsl(0, 0%, 95%) - Off-white for readability
- **Text Muted**: hsl(0, 0%, 60%) - Light gray for secondary text
- **Border**: hsl(0, 0%, 20%) - Subtle gray for definition
- **Muted**: hsl(0, 0%, 10%) - Dark gray for subtle backgrounds

### Preview Colors
- Color 1: hsl(45, 100%, 53%) - Gold primary
- Color 2: hsl(0, 100%, 27%) - Deep red secondary
- Color 3: hsl(0, 0%, 0%) - Black accent

## Foundations

### Typography Scale
- **Display**: 64px/72px - Hero headlines, major announcements
- **H1**: 48px/56px - Page titles, product names on detail pages
- **H2**: 36px/44px - Section headers, category titles
- **H3**: 28px/36px - Subsection titles, product card titles
- **H4**: 24px/32px - Component headers, filter labels
- **Body Large**: 18px/28px - Product descriptions, featured content
- **Body**: 16px/24px - Standard text, product details
- **Body Small**: 14px/20px - Meta information, secondary details
- **Caption**: 12px/16px - Labels, tags, legal text

### Font Families
- **Primary**: 'Playfair Display', serif - Display headlines, product names
- **Secondary**: 'Inter', sans-serif - Body text, UI elements
- **Accent**: 'Montserrat', sans-serif - CTAs, bold statements

### Font Weights
- **Light**: 300 - Subtle elegance for large display text
- **Regular**: 400 - Body text and general content
- **Medium**: 500 - Emphasis and subheadings
- **Semibold**: 600 - Buttons and strong emphasis
- **Bold**: 700 - Headlines and hero text

### Spacing Scale
- **xs**: 4px - Tight element spacing, icon padding
- **sm**: 8px - Compact layouts, badge spacing
- **md**: 16px - Standard component padding
- **lg**: 24px - Section spacing, card padding
- **xl**: 32px - Large component separation
- **2xl**: 48px - Major section breaks
- **3xl**: 64px - Hero sections, dramatic spacing
- **4xl**: 96px - Page-level vertical rhythm

### Grid System
- **Container Max Width**: 1440px - Premium wide layout
- **Columns**: 12-column flexible grid
- **Gutter**: 24px (desktop), 16px (mobile)
- **Breakpoints**:
  - Mobile: 320px-767px
  - Tablet: 768px-1023px
  - Desktop: 1024px-1439px
  - Large: 1440px+

### Iconography
- **Library**: Lucide React (consistent, modern icons)
- **Sizes**: 16px (small), 20px (default), 24px (medium), 32px (large)
- **Style**: Stroke-based, 2px stroke weight for elegance
- **Usage**: Shopping cart, wishlist, filters, social proof badges

## Component Styling

### Buttons
- **Primary (Gold)**: Gold background, black text, 2px black border on hover, scale(1.02) transform
- **Secondary (Red)**: Deep red background, white text, subtle glow on hover
- **Outline**: Transparent background, gold border, gold text, filled on hover
- **Ghost**: Minimal styling, underline on hover for links
- **Sizes**: Small (36px), Medium (44px), Large (56px) height
- **Border Radius**: 2px for sharp, modern aesthetic

### Product Cards
- **Background**: Pure white (light) / Dark charcoal (dark)
- **Border**: 1px solid border color, changes to gold on hover
- **Padding**: 16px
- **Image Ratio**: 1:1 square for consistency
- **Hover**: Lift effect (translateY(-4px)), subtle shadow, border color change
- **Quick View**: Overlay button appears on hover with backdrop blur

### Hero Section
- **Height**: 85vh minimum for impact
- **Background**: Full-bleed product imagery with gradient overlay (black to transparent)
- **Text**: Large display typography (64px+) in white or gold
- **CTA Placement**: Prominently positioned with gold primary button
- **Animation**: Subtle parallax scroll effect on background image

### Filters & Navigation
- **Filter Pills**: Rounded (24px), outlined when inactive, filled with gold when active
- **Dropdown**: Dark card background, subtle border, smooth slide-down animation
- **Sorting**: Inline dropdown with gold highlight on selected option
- **Mobile**: Slide-in drawer from left with backdrop overlay

### Notifications (Drops)
- **Toast Position**: Top-right corner
- **Style**: Dark background with gold accent border
- **Icon**: Bell icon with red dot for urgency
- **Animation**: Slide-in from top with bounce effect
- **Duration**: 5 seconds with progress bar

### Cart & Checkout
- **Cart Drawer**: Slide from right, full-height overlay
- **Item Cards**: Compact horizontal layout with thumbnail
- **Price Display**: Large, bold gold typography
- **Checkout CTA**: Full-width gold button with lock icon
- **Progress Indicator**: Gold progress bar showing checkout steps

## Animation & Micro-interactions

### Timing Functions
- **Default**: cubic-bezier(0.4, 0, 0.2, 1) - Smooth, elegant
- **Bounce**: cubic-bezier(0.68, -0.55, 0.265, 1.55) - Playful emphasis
- **Snappy**: cubic-bezier(0.25, 0.46, 0.45, 0.94) - Quick response

### Durations
- **Fast**: 150ms - Hover states, button presses
- **Medium**: 300ms - Card transitions, drawer slides
- **Slow**: 500ms - Page transitions, hero animations

### Key Animations
- **Hover Effects**: Scale(1.02-1.05), translateY(-2px to -4px), opacity changes
- **Page Load**: Stagger fade-in for product grids (100ms delay between items)
- **Hero**: Subtle zoom-in on hero image (scale 1.0 to 1.05 over 20s)
- **Button Press**: Scale(0.98) for tactile feedback
- **Drop Notification**: Slide + bounce from top with shake on arrival
- **Add to Cart**: Fly to cart animation with particle effect

### Scroll Animations
- **Parallax**: Hero background moves slower than foreground (0.5x speed)
- **Fade Up**: Content fades in and moves up 20px as it enters viewport
- **Stagger**: Product cards animate in sequence with 80ms delay
- **Progress Bar**: Sticky header with scroll progress indicator (gold line)

## Theming

### Light/Dark Mode Toggle
- **Control**: Icon toggle in header (sun/moon)
- **Storage**: localStorage preference with system default fallback
- **Transition**: Smooth 300ms color transitions on all elements
- **Images**: Adjust opacity/brightness for dark mode compatibility

### Theme Mapping
```
Light Mode Primary Use: Product highlights, CTAs, sale badges
Dark Mode Primary Use: Navigation accents, premium feel, focus states

Light Mode Background: Clean, gallery-like product presentation
Dark Mode Background: Luxury boutique atmosphere, product focus

Text Contrast: Always maintain 4.5:1 minimum ratio
```

## Dark Mode & Color Contrast Rules (Critical)

### Explicit Color Guidelines
- Always use explicit colors - never rely on browser defaults or component variants like 'variant="outline"'
- Force dark mode with CSS: 'html { color-scheme: dark; }' and 'meta name="color-scheme" content="dark"'
- Use high contrast ratios: minimum 4.5:1 for normal text, 3:1 for large text
- Override browser defaults with '!important' for form elements: 'input, textarea, select { background-color: #0d0d0d !important; color: #f2f2f2 !important; border-color: #333333 !important; }'
- Test in both light and dark system modes - system dark mode can override custom styling
- Use semantic color classes instead of component variants: 'className="bg-[#0d0d0d] text-[#f2f2f2] border border-[#333333]"' not 'variant="outline"'
- Create CSS custom properties for consistency across components
- Quick debugging: check if using 'variant="outline"', add explicit colors, use '!important' if needed, test system modes

### Gold on Black Exception
- Gold text (#D4AF37) on pure black (#000000) achieves 8.2:1 ratio - exceeds AAA standard
- Gold buttons on black background are premium and accessible
- Use white text on gold buttons for maximum contrast

### Color Contrast Checklist (apply to all components)
- [ ] No 'variant="outline"' or similar browser-dependent styles
- [ ] Explicit background and text colors specified using hex values
- [ ] High contrast ratios (4.5:1+ for text, 3:1+ for large text)
- [ ] Tested with system dark mode ON and OFF
- [ ] Form elements have forced dark styling with !important
- [ ] Badges and buttons use custom classes with explicit colors
- [ ] Placeholder text uses #999999 (light) / #666666 (dark)
- [ ] Focus states use gold (#D4AF37) ring with 2px width
- [ ] Product cards maintain border visibility in both modes
- [ ] Price text uses gold (#D4AF37) for premium emphasis

## Special Components

### Size Selector
- **Layout**: Horizontal pill group with outlined boxes
- **Active State**: Gold background with black text
- **Sold Out**: Red diagonal line overlay with 50% opacity
- **Accessibility**: Clear focus states with gold ring

### "Drop" Alert Signup
- **Form Style**: Inline email input with integrated submit button
- **Placement**: Sticky bar at bottom or modal overlay
- **Visual**: Red accent with countdown timer if applicable
- **Success State**: Checkmark animation with confetti particle effect

### Product Quick View Modal
- **Background**: Backdrop blur with 80% opacity overlay
- **Card**: Centered, max 900px width, elevated shadow
- **Layout**: Split - image left (60%), details right (40%)
- **Close**: X button with gold hover state
- **Animation**: Scale up from 0.9 to 1.0 with fade-in

## Responsive Behavior

### Mobile Optimization
- **Navigation**: Hamburger menu with full-screen drawer
- **Product Grid**: 2 columns on mobile, 3 on tablet, 4-5 on desktop
- **Typography**: Scale down by 20% on mobile while maintaining hierarchy
- **Touch Targets**: Minimum 44px height for all interactive elements
- **Images**: Lazy load with blur-up placeholder effect

### Desktop Enhancements
- **Hover States**: Rich interactions with scale and shadow effects
- **Mega Menu**: Category navigation with featured product imagery
- **Sticky Elements**: Persistent cart counter and filter sidebar
- **Animations**: More pronounced parallax and scroll effects

## Implementation Notes

### CSS Custom Properties Setup
```css
:root {
  --gold: #D4AF37;
  --red: #8B0000;
  --black: #000000;
  --white: #FFFFFF;
  --spacing-unit: 8px;
  --animation-speed: 300ms;
  --border-radius: 2px;
}
```

### Performance Considerations
- Use 'transform' and 'opacity' for animations (GPU accelerated)
- Implement intersection observer for scroll animations
- Lazy load images below the fold with loading="lazy"
- Preload critical hero images
- Use CSS containment for product cards: 'contain: layout style paint'

### Accessibility
- Maintain focus indicators with gold ring (2px solid)
- ARIA labels for icon-only buttons
- Semantic HTML structure (nav, main, article, section)
- Alt text for all product images with descriptive names
- Keyboard navigation support for all interactive elements
