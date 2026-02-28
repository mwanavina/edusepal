# EDUSEPAL Setup Guide - Clerk, Tiptap & Theme Mode

This guide walks you through setting up the latest features added to the EDUSEPAL platform:
- **Clerk Authentication** with database sync
- **Tiptap Rich Text Editor** for course content
- **Dark/Light Theme Mode** toggle

## 1. Clerk Authentication Setup

### Step 1: Create Clerk Account & Application
1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Select your authentication methods (Email, Google, GitHub, etc.)

### Step 2: Get Your Clerk Keys
1. Go to **API Keys** in your Clerk dashboard
2. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Step 3: Set Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Step 4: Set Up Webhooks for Database Sync
This automatically syncs Clerk users to your Supabase database.

1. In Clerk Dashboard, go to **Webhooks**
2. Create a new endpoint:
   - **URL**: `https://yourdomain.com/api/webhooks/clerk`
   - **Events**: Select `user.created`, `user.updated`, `user.deleted`
3. Copy the **Signing Secret**
4. Add to `.env.local`:
```env
CLERK_WEBHOOK_SECRET=whsec_...
```

### Step 5: Migrate Your Auth Components
The app now uses Clerk instead of Supabase Auth. Update your auth components:

**Old (Supabase Auth):**
```tsx
import { createClient } from '@/lib/supabase/client'
const { data: { user } } = await supabase.auth.getUser()
```

**New (Clerk):**
```tsx
import { useUser, useAuth } from '@clerk/nextjs'
const { user } = useUser()
const { userId } = useAuth()
```

### How Clerk-to-Database Sync Works

When a user authenticates with Clerk:
1. Clerk webhook sends event to `/api/webhooks/clerk`
2. Webhook verifies signature using `CLERK_WEBHOOK_SECRET`
3. `lib/clerk-sync.ts` creates/updates user in `profiles` table
4. User profile includes:
   - `clerk_id` - Unique Clerk user ID
   - `id` (UUID) - Database UUID for relationships
   - Email, name, profile image
   - Role, verification status, etc.

**Profile columns:**
- `id` (UUID) - Primary key, used in all relationships
- `clerk_id` (TEXT) - Links to Clerk user
- `email` - User email
- `first_name`, `last_name` - User name
- `profile_image_url` - Avatar
- `role` - 'learner', 'instructor', 'admin'
- `bio`, `headline`, `website` - Profile info
- `is_verified`, `email_verified` - Verification status

**RLS Policies** now use `clerk_id` via `current_setting('app.clerk_id', true)`:
```sql
-- Example policy
CREATE POLICY "enrollments_select_own" ON public.enrollments 
FOR SELECT USING (
  user_id IN (
    SELECT id FROM public.profiles 
    WHERE clerk_id = current_setting('app.clerk_id', true)
  )
);
```

## 2. Tiptap Rich Text Editor Setup

### What's Included
- **TiptapEditor** component for rich text editing
- Full toolbar with formatting options
- Support for: Bold, Italic, Lists, Headings, Quotes, Code, Links, Images
- Undo/Redo functionality
- Dark mode support

### Using Tiptap in Your Code

**In Course Creation Form:**
```tsx
import { TiptapEditor } from '@/components/tiptap-editor'

<TiptapEditor
  value={formData.rich_description}
  onChange={(value) => setFormData({ ...formData, rich_description: value })}
  placeholder="Enter course content..."
/>
```

### Database Integration
- Store HTML output in `courses.rich_description` column
- Display HTML in course detail pages
- Use `dangerouslySetInnerHTML` when rendering (with sanitization)

**Files:**
- `components/tiptap-editor.tsx` - Main editor component
- `components/tiptap-editor.css` - Styling for editor output

## 3. Dark/Light Theme Mode Setup

### Theme Provider Integration
Already integrated in `app/layout.tsx`:
```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

### Using Theme Toggle
Add the theme toggle button to your navbar:
```tsx
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle />
```

### How It Works
- Uses `next-themes` library
- Stores preference in localStorage
- Supports: Light, Dark, System
- Applies `dark` class to `<html>` element
- CSS variables update based on theme

### Color System
The app uses OKLCH color space for better color accuracy:

**Light Theme:**
- Background: Light white
- Foreground: Dark text
- Primary: Green (#4CAF50 equivalent)

**Dark Theme:**
- Background: Very dark (#1a1a1a equivalent)
- Foreground: Light text
- Primary: Brighter green

See `app/globals.css` for complete color definitions.

## 4. Database Schema Updates for Clerk

### New Columns Added to `profiles`
```sql
ALTER TABLE public.profiles ADD COLUMN clerk_id TEXT UNIQUE NOT NULL;
```

### Migration Changes
- `auth.users` references removed
- All foreign keys now reference `profiles(id)`
- RLS policies updated to use Clerk context
- Preserved all existing functionality

### Existing Relationships
All 21 tables maintain their relationships:
- `users` → `enrollments` → `lessons`
- `users` → `courses` (as instructor)
- `users` → `certificates`
- `users` → `payments`
- `users` → `earnings`
- And more...

## 5. Environment Variables Checklist

Create `.env.local` with:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
CLERK_WEBHOOK_SECRET=your_secret

# Optional
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 6. Testing Your Setup

### Test Clerk Auth
1. Start dev server: `npm run dev`
2. Visit `/auth/sign-up`
3. Create a test account
4. Check Supabase: New profile should appear in `profiles` table
5. Check `clerk_id` is populated

### Test Tiptap Editor
1. Login as instructor
2. Go to `/instructor/create-course`
3. Fill in course info
4. Use the Tiptap editor
5. Create course
6. Verify `rich_description` is saved

### Test Theme Toggle
1. Look for sun/moon icon in navbar
2. Click to change theme
3. Page should switch between light/dark
4. Refresh page - preference should persist

## 7. API Documentation

### Clerk Webhook Handler
**Endpoint:** `POST /api/webhooks/clerk`

**Events:**
- `user.created` - Syncs new Clerk user to database
- `user.updated` - Updates profile with new info
- `user.deleted` - Removes user from database

**Response:**
```json
{
  "success": true,
  "action": "created" | "updated" | "deleted"
}
```

### Clerk Sync Functions
Located in `lib/clerk-sync.ts`:

**syncClerkUserToDatabase()**
- Creates or updates user profile
- Called automatically by webhook
- Can also be called manually after auth

**handleClerkUserDeletion()**
- Removes user profile
- Called by webhook on user deletion
- Cascades deletes to related records

**getOrCreateUserProfile()**
- Fetches user profile by clerk_id
- Returns null if not found
- Safe to call anytime

## 8. Next Steps

### Update Existing Pages
Update auth-dependent pages to use Clerk:
- `/auth/login` - Use Clerk's SignIn component
- `/auth/sign-up` - Use Clerk's SignUp component
- `/dashboard` - Use `useUser()` instead of `useAuth()`

### Add Clerk Sign-In Components
```tsx
import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return <SignIn />
}
```

### Protected Routes
Wrap routes that require auth:
```tsx
import { auth } from '@clerk/nextjs/server'

export default async function ProtectedPage() {
  const { userId } = await auth()
  if (!userId) return redirect('/auth/login')
  // ...
}
```

### Update User Data
When showing user info, query the `profiles` table:
```tsx
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('clerk_id', user.id)
  .single()
```

## 9. Troubleshooting

### Users not syncing to database
- Check `CLERK_WEBHOOK_SECRET` matches webhook in Clerk dashboard
- Verify webhook URL is correct and accessible
- Check server logs for errors in `/api/webhooks/clerk`
- Manually call `syncClerkUserToDatabase()` if needed

### Tiptap editor not rendering
- Ensure `@tiptap/*` packages are installed
- Check `components/tiptap-editor.css` is imported
- Verify TailwindCSS is configured correctly

### Theme not switching
- Clear browser localStorage
- Check `next-themes` is properly initialized
- Verify `<html suppressHydrationWarning>` is in layout

### RLS policy errors
- Ensure `app.clerk_id` is set before queries
- Update policies with clerk_id in the function
- Check user is synced to database (clerk_id not null)

## 10. Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Tiptap Documentation](https://tiptap.dev)
- [Next Themes GitHub](https://github.com/pacocoursey/next-themes)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
