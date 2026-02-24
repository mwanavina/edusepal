# Theme System Implementation

## Overview

The EDUSEPAL platform includes a complete dark/light mode theme system powered by **next-themes** with custom color definitions.

## Components

### 1. ThemeProvider (`components/theme-provider.tsx`)
- Wraps the entire app in root layout
- Handles theme persistence and detection
- Supports: light, dark, and system preference modes

### 2. ThemeToggle (`components/theme-toggle.tsx`)
- Interactive button with sun/moon icons
- Dropdown menu for theme selection
- Visual indicator of current theme
- Includes proper hydration handling

### 3. CSS Variables (`app/globals.css`)
- Light theme colors (`:root` selector)
- Dark theme colors (`.dark` selector)
- Uses oklch() color space for better color management
- Smooth transitions between themes

## How It Works

```
User clicks Theme Toggle
    ↓
ThemeToggle calls setTheme('dark'|'light'|'system')
    ↓
next-themes adds/removes .dark class from <html>
    ↓
CSS automatically switches to new color variables
    ↓
Preference saved to localStorage
    ↓
Theme persists on page reload
```

## Usage

### For Users
1. Click the sun/moon icon in the top navigation bar
2. Select your preferred theme: Light, Dark, or System
3. Page colors change immediately
4. Your preference is remembered

### For Developers

**Enable Theme Toggle on a Page:**
```tsx
import { ThemeToggle } from '@/components/theme-toggle'

export default function MyPage() {
  return (
    <nav>
      <ThemeToggle />
    </nav>
  )
}
```

**Access Current Theme in Component:**
```tsx
'use client'

import { useTheme } from 'next-themes'

export default function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return (
    <div>
      Current theme: {theme}
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  )
}
```

## Color System

### Light Theme (Default)
```css
--background: oklch(0.98 0.002 0);        /* Off-white */
--foreground: oklch(0.15 0.02 0);         /* Dark gray */
--primary: oklch(0.4 0.16 142);           /* Green */
--secondary: oklch(0.6 0.1 142);          /* Light green */
```

### Dark Theme
```css
--background: oklch(0.12 0.01 0);         /* Very dark gray */
--foreground: oklch(0.95 0.01 0);         /* Off-white */
--primary: oklch(0.55 0.18 142);          /* Bright green */
--secondary: oklch(0.35 0.12 142);        /* Dark green */
```

## Features

✓ **Multiple Themes**: Light, Dark, System preference
✓ **Persistent**: Saves to localStorage
✓ **Instant**: No page reload needed
✓ **No Flash**: Hydration-safe
✓ **Accessible**: Proper contrast ratios
✓ **Smooth**: CSS transitions
✓ **SSR Safe**: Works with Next.js rendering
✓ **System Aware**: Respects OS dark mode preference

## Files Involved

```
app/
├── layout.tsx                 # ThemeProvider setup
├── globals.css               # Color definitions
├── page.tsx                  # Uses ThemeToggle
├── dashboard/page.tsx        # Uses ThemeToggle
└── instructor/page.tsx       # Uses ThemeToggle

components/
├── theme-provider.tsx        # Provider wrapper
├── theme-toggle.tsx          # Toggle UI
└── ui/button.tsx             # Used by toggle
```

## Dependencies

- **next-themes** - Theme management library
- **lucide-react** - Sun/Moon icons
- **Tailwind CSS** - Styling framework
- **React** - UI framework

## Browser Storage

Theme preference is stored in `localStorage` as:
```json
{
  "theme": "dark"
}
```

To check current theme in browser console:
```javascript
localStorage.getItem('theme')
```

To reset theme:
```javascript
localStorage.removeItem('theme')
location.reload()
```

## Known Issues & Solutions

### Theme Not Changing
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Rebuild app: `pnpm install && pnpm run dev`

### Hydration Warning
- Already handled in components
- Uses `isMounted` state in ThemeToggle
- `suppressHydrationWarning` on `<html>` tag

### Dark Mode Not Applying
- Ensure `.dark` class is in globals.css
- Check if next-themes is properly installed
- Verify browser supports CSS custom properties

## Customization

To change colors, edit `app/globals.css`:

```css
:root {
  --primary: oklch(0.4 0.16 142);  /* Change this value */
  /* ... other colors ... */
}

.dark {
  --primary: oklch(0.55 0.18 142);  /* And this */
  /* ... other colors ... */
}
```

To add new colors, define them in `:root` and `.dark`, then use:
```tsx
<div className="bg-primary text-primary-foreground">
  Uses your custom color
</div>
```

## Testing

Run the test script:
```bash
node scripts/test-theme.js
```

This verifies:
- next-themes is installed
- All theme files exist
- Color system is properly configured

## Performance

- **Bundle Size**: next-themes is ~3KB
- **Runtime**: Zero JavaScript overhead after initialization
- **Theme Switch**: Instant (CSS class toggle)
- **localStorage**: Single write per theme change

## Troubleshooting Guide

See `QUICK_FIX_THEME.md` for common issues and solutions.

## Future Enhancements

Potential improvements:
- [ ] Theme preview before applying
- [ ] Custom theme creation UI
- [ ] Export/import theme preferences
- [ ] Auto theme based on time of day
- [ ] Theme animation effects
- [ ] Theme analytics
