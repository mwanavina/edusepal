# EDUSEPAL Header Redesign

## Overview
The navigation header has been redesigned to provide a clean, modern, and mobile-optimized experience following the design pattern from the reference image.

## Design Pattern

### Mobile Header (`components/mobile-header.tsx`)
**Visible on screens: < 768px (md breakpoint)**

Layout: `[Hamburger Menu] [Logo] [Search Icon]`

- **Hamburger Menu (Left)**: 
  - Toggles a dropdown menu with navigation links
  - Contains: Courses, About, Pricing links
  - Theme toggle
  - Sign In button
  - Get Started CTA button
  - Smooth slide-in animation

- **Logo (Center)**: 
  - Responsive text size
  - Centered for balance

- **Search Icon (Right)**: 
  - Links to search page
  - Clean icon-only button

### Desktop Header (`components/desktop-header.tsx`)
**Visible on screens: ≥ 768px (md breakpoint)**

Layout: `[Logo] [Search Bar] [Theme] [Sign In] [Get Started]`

- Full search bar with input field
- All actions visible at once
- No hamburger menu needed
- Comfortable spacing and typography

## Implementation Details

### Component Structure
```
MobileHeader
├── Hamburger button (Menu/X icon)
├── Logo
├── Search icon link
└── Dropdown Menu (when open)
    ├── Navigation links (Courses, About, Pricing)
    ├── Theme toggle
    ├── Sign In link
    └── Get Started button

DesktopHeader
├── Logo
├── Search bar component
├── Theme toggle
├── Sign In button
└── Get Started button
```

### Responsive Behavior
- **Mobile (< 768px)**: Only MobileHeader visible
- **Desktop (≥ 768px)**: Only DesktopHeader visible
- Clean separation using Tailwind's `hidden` and `md:block` classes

### Features
- **Smooth animations**: Dropdown menu slides in smoothly
- **Theme persistence**: Theme toggle available in both views
- **Accessibility**: Proper aria-labels and semantic buttons
- **Touch-friendly**: Larger tap targets for mobile (40px+ minimum)
- **Consistent branding**: Same logo and color scheme across both headers

## Usage

### Importing in Pages
```tsx
import { MobileHeader } from '@/components/mobile-header'
import { DesktopHeader } from '@/components/desktop-header'

export default function Page() {
  return (
    <>
      <MobileHeader />
      <DesktopHeader />
      {/* Page content */}
    </>
  )
}
```

### Pages Updated
- ✅ Home (/)
- ✅ About (/about)
- ✅ Pricing (/pricing)
- ✅ Blog (/blog)
- ✅ Certificates (/certificates)

### Pages to Update (if created)
- Careers (/careers)
- Contact (/contact)
- Terms (/terms)
- Privacy (/privacy)
- Courses (/courses)
- Instructor pages

## Customization

### Adding New Navigation Links
Edit `mobile-header.tsx` in the dropdown menu section:
```tsx
<Link
  href="/your-page"
  className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
  onClick={() => setIsOpen(false)}
>
  Your Page
</Link>
```

### Styling Changes
- Colors: Use existing `text-foreground`, `bg-muted`, `hover:bg-muted` classes
- Spacing: Adjust `px-4 py-2` for padding
- Animations: Modify `animate-in slide-in-from-top-2` for different effects

## Benefits
1. **Clean visual design**: Minimal, uncluttered interface
2. **Mobile-first approach**: Optimized experience for phones first
3. **Scalable**: Easy to add more navigation items
4. **Accessible**: Proper semantic HTML and ARIA labels
5. **Consistent**: Reusable components across all pages
6. **Performance**: Lightweight, no unnecessary dependencies

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers
