# Clerk Authentication Error Fix - Summary

## Problem
The application was throwing the error:
```
Uncaught Error: Clerk: auth() and currentUser() are only supported in App Router (/app directory).
If you're using /pages, try getAuth() instead.
Original error: TypeError: undefined: Key Symbol(async_id_symbol) in undefined.headers is a symbol, which cannot be converted to a ByteString.
```

## Root Cause
The issue occurred because:
1. **Old Supabase middleware was still active** - The middleware.ts file was trying to use Supabase auth functions which conflicted with Clerk
2. **Incorrect header handling** - The old middleware was trying to access headers synchronously when they need to be async
3. **Mixed authentication systems** - Supabase auth and Clerk auth were competing for control

## Solutions Implemented

### 1. **Updated middleware.ts**
- Replaced old Supabase auth middleware with Clerk's `clerkMiddleware`
- Uses `createRouteMatcher` to protect specific routes (dashboard, instructor, certificates)
- Properly handles async operations without header conflicts
- File: `/vercel/share/v0-project/middleware.ts`

### 2. **Fixed /api/users/sync route**
- Removed dependency on `auth()` function from Clerk
- Changed from calling `createClient()` directly to `await createClient()`
- Receives user data from client-side via JSON payload
- Properly handles Supabase errors and creates/updates profiles
- File: `/vercel/share/v0-project/app/api/users/sync/route.ts`

### 3. **Created Proper Clerk Auth Utilities**
- New file: `/vercel/share/v0-project/lib/clerk-auth.ts`
- Contains server-side functions: `getCurrentClerkUser()`, `getClerkSession()`, `syncClerkUserToDB()`
- These should be used in Server Components and API routes only
- Never call these in client components

### 4. **Improved useSyncUser Hook**
- Changed from direct Supabase calls to calling the `/api/users/sync` API endpoint
- Client hook calls server endpoint (safer, avoids header issues)
- Added sync deduplication with `useRef` to prevent duplicate requests
- File: `/vercel/share/v0-project/hooks/use-sync-user.ts`

### 5. **Fixed Webhook Handler**
- Added proper error handling for async headers
- Wrapped in try-catch block
- Proper indentation and error context
- File: `/vercel/share/v0-project/app/api/webhooks/clerk/route.ts`

## Architecture Overview

### Client-Side (Browser)
- Use `useUser()` hook from `@clerk/nextjs`
- Call API endpoints for server operations
- Never call `auth()` or `currentUser()` directly

### Server-Side (API Routes & Actions)
- Use `createClient()` from `@/lib/supabase/server`
- Use Clerk functions from `/lib/clerk-auth.ts` for special needs
- Always `await` the client creation

### Authentication Flow
1. User signs up/logs in via Clerk UI
2. `useSyncUser()` hook detects logged-in user
3. Hook calls `/api/users/sync` with user data
4. API route creates/updates profile in Supabase
5. User can now access protected pages (checked by middleware)

## Environment Variables Required
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
CLERK_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Fix

1. **Clear browser cache** - Old Clerk config might be cached
2. **Restart dev server** - `pnpm dev`
3. **Check console** - Should see "[User Sync] User synced successfully"
4. **Verify database** - Profile should be created in Supabase

## What Changed

| Component | Before | After |
|-----------|--------|-------|
| middleware.ts | Supabase auth | Clerk auth |
| /api/users/sync | Direct auth() call | JSON payload from client |
| useSyncUser | Direct DB insert | API endpoint call |
| Clerk functions | Mixed in various files | Centralized in lib/clerk-auth.ts |

## Files Modified
- `middleware.ts` - Clerk middleware setup
- `app/api/users/sync/route.ts` - Proper async/await and Supabase client
- `hooks/use-sync-user.ts` - Client-side sync hook
- `app/api/webhooks/clerk/route.ts` - Fixed header handling
- `lib/clerk-auth.ts` - NEW: Server-side Clerk utilities

## Next Steps
1. Set up Clerk environment variables
2. Configure Clerk webhook pointing to `/api/webhooks/clerk`
3. Test sign up/sign in flow
4. Verify user syncs to database
