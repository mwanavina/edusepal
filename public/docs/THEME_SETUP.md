# Theme Mode Setup & Troubleshooting

## Current Status

The theme switcher (dark/light mode) is implemented using **next-themes** and should work. However, if it's not responding, follow the troubleshooting steps below.

## How Theme Switching Works

1. **ThemeProvider** (`components/theme-provider.tsx`) - Wraps the app in the root layout
2. **ThemeToggle** (`components/theme-toggle.tsx`) - Component for switching themes
3. **CSS Variables** - Define colors in `app/globals.css` with `:root` (light) and `.dark` (dark)

## Troubleshooting Theme Issues

### Issue: Theme toggle button not responding

**Solution 1: Clear Browser Cache & Hard Refresh**
```bash
# On browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

**Solution 2: Check Network Activity**
- Open DevTools (F12)
- Go to Console tab
- Look for any errors related to theme or next-themes
- Verify the ThemeToggle component is rendering

**Solution 3: Verify next-themes is Installed**
```bash
pnpm list next-themes
# Should show: next-themes@0.4.6
```

**Solution 4: Rebuild the Application**
```bash
pnpm install
pnpm run build
pnpm run dev
```

### Issue: Hydration Mismatch Errors

This happens when server and client render different content. Our fix:
- Added `suppressHydrationWarning` to `<html>` tag
- Added `isMounted` state check in ThemeToggle to prevent mismatches
- Added `disableTransitionOnChange` to ThemeProvider

### Issue: Theme Changes Not Persisting

**Check**: Ensure localStorage is not disabled in browser
- Open DevTools → Application/Storage tab
- Check if localStorage has entries for `theme-storage`
- Clear localStorage if corrupted: `localStorage.clear()` in console

### Issue: Still Getting Clerk Errors

**Why**: Clerk is installed as a dependency but not configured
**Solution**: 

Option A - Temporarily Remove Clerk (Recommended for now):
```bash
# This won't break anything - we just commented out the usage
pnpm remove @clerk/nextjs
```

Option B - Suppress Clerk Warnings:
Create a `.env.local` file with dummy values:
```
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dummy
CLERK_SECRET_KEY=sk_test_dummy
```

## Testing Theme Switching

1. **Open the app** - Visit http://localhost:3000
2. **Click theme toggle** - Look for sun/moon icon in top navigation
3. **Select light/dark/system** - Page should change colors immediately
4. **Refresh page** - Theme preference should persist
5. **Open DevTools Console** - Should see no errors

## Files Involved

- `app/layout.tsx` - Root layout with ThemeProvider
- `components/theme-provider.tsx` - Theme provider wrapper
- `components/theme-toggle.tsx` - Theme switcher UI
- `app/globals.css` - Light/dark color definitions
- `package.json` - Dependencies (next-themes)

## CSS Color System

Colors are defined using oklch() color space:
- `:root` selector = Light theme colors
- `.dark` selector = Dark theme colors
- Variables: `--background`, `--foreground`, `--primary`, `--secondary`, etc.

When theme changes from light to dark:
1. `next-themes` adds/removes `.dark` class from `<html>`
2. CSS automatically uses `.dark` variables
3. Transition is smooth (enabled by default)

## Manual Testing in Console

```javascript
// Check current theme
const theme = localStorage.getItem('theme-storage');
console.log('Current theme:', theme);

// Set theme manually
localStorage.setItem('theme-storage', JSON.stringify({ state: 'dark' }));
location.reload();
```

## Performance Notes

- Theme toggle uses React hooks (useTheme)
- Mounts on client-side only (prevents hydration issues)
- Stores preference in localStorage automatically
- Respects system preference if set to 'system'

## When Ready: Re-enable Clerk

Once Clerk environment variables are configured:
1. Uncomment `ClerkProvider` in `app/layout.tsx`
2. Set environment variables in `.env.local`
3. Uncomment Clerk imports in dashboard/instructor pages
4. Rebuild the app

The theme system will continue to work alongside Clerk authentication.
