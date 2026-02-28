# Clerk Authentication Setup for EDUSEPAL

This guide explains how to set up Clerk authentication and integrate it with the EDUSEPAL platform.

## What is Clerk?

Clerk is a comprehensive authentication platform that provides:
- Email & password authentication
- Social login (Google, GitHub, etc.)
- Multi-factor authentication (MFA)
- User management dashboard
- Session management
- Webhooks for real-time user events

## Setup Steps

### 1. Install Clerk Dependencies

```bash
npm install @clerk/nextjs
```

### 2. Set Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/sign-up-success
```

### 3. Update Middleware

The current `middleware.ts` still uses Supabase. For Clerk, you'll need to update it:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/instructor(.*)',
  '/admin(.*)',
  '/certificates(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### 4. Update Layout with ClerkProvider

Update `app/layout.tsx`:

```typescript
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
```

### 5. Update Sign Up Page

Replace the Supabase sign-up with Clerk's `<SignUp />` component:

```typescript
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SignUp />
    </div>
  );
}
```

### 6. Update Login Page

Replace the Supabase login with Clerk's `<SignIn />` component:

```typescript
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SignIn />
    </div>
  );
}
```

### 7. Create/Update Profile on Sign Up

Use Clerk's webhook to create a profile in the database when a user signs up:

**File**: `app/api/webhooks/clerk/route.ts`

```typescript
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  // Get the webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
  }

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get body
  const body = await req.text()

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any
  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Get the ID and type
  const { id } = evt.data
  const eventType = evt.type

  // Handle user.created event
  if (eventType === 'user.created') {
    const { id: clerk_id, email_addresses, first_name, last_name } = evt.data

    // Get primary email
    const primaryEmail = email_addresses[0]?.email_address

    // Create Supabase client
    const supabase = await createClient()

    // Insert profile
    const { error } = await supabase.from('profiles').insert({
      clerk_id,
      email: primaryEmail,
      first_name: first_name || '',
      last_name: last_name || '',
      user_type: 'learner', // Default to learner
    })

    if (error) {
      console.error('Error creating profile:', error)
      return new Response('Error creating profile', { status: 500 })
    }
  }

  // Handle user.updated event (sync changes)
  if (eventType === 'user.updated') {
    const { id: clerk_id, email_addresses, first_name, last_name } = evt.data
    const primaryEmail = email_addresses[0]?.email_address

    const supabase = await createClient()

    const { error } = await supabase
      .from('profiles')
      .update({
        email: primaryEmail,
        first_name: first_name || '',
        last_name: last_name || '',
      })
      .eq('clerk_id', clerk_id)

    if (error) {
      console.error('Error updating profile:', error)
      return new Response('Error updating profile', { status: 500 })
    }
  }

  // Handle user.deleted event
  if (eventType === 'user.deleted') {
    const { id: clerk_id } = evt.data

    const supabase = await createClient()

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('clerk_id', clerk_id)

    if (error) {
      console.error('Error deleting profile:', error)
      return new Response('Error deleting profile', { status: 500 })
    }
  }

  return new Response('Webhook received', { status: 200 })
}
```

### 8. Add Clerk Webhook Secret

In Clerk Dashboard:
1. Go to Webhooks
2. Create a new webhook pointing to: `https://yourapp.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret and add to `.env.local` as `CLERK_WEBHOOK_SECRET`

### 9. Update Database Queries to Use clerk_id

When querying user data, use clerk_id from the Clerk session:

```typescript
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function getUserProfile() {
  const { userId } = await auth()
  
  if (!userId) return null

  const supabase = await createClient()

  // Query using clerk_id
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  return data
}
```

### 10. Set RLS Context for Database Queries

Before making queries, set the Clerk ID in the database context:

```typescript
import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'

export async function getEnrollments() {
  const { userId } = await auth()
  
  if (!userId) return []

  const supabase = await createClient()

  // Set Clerk ID in context for RLS
  await supabase.rpc('set_clerk_id', { clerk_id: userId })

  const { data, error } = await supabase
    .from('enrollments')
    .select('*')

  return data
}
```

Create this RLS helper function in your database:

```sql
CREATE OR REPLACE FUNCTION set_clerk_id(clerk_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.clerk_id', clerk_id, false);
END;
$$;
```

## User Management Dashboard

Clerk provides a built-in user management dashboard. Access it at:
- Clerk Dashboard: https://dashboard.clerk.com
- Your app's user management: `[your-app-url]/user-profile` (sign-in required)

## User Object Structure

After a user signs in with Clerk, you can access their info:

```typescript
import { auth, currentUser } from "@clerk/nextjs/server";

const { userId } = await auth();
const user = await currentUser();

// user object contains:
// - id: string (clerk_id)
// - emailAddresses: EmailAddress[]
// - firstName: string
// - lastName: string
// - imageUrl: string
// - primaryEmailAddress: EmailAddress
// - createdAt: Date
// - updatedAt: Date
// etc.
```

## Social Login Setup

To enable social login (Google, GitHub, etc.):

1. In Clerk Dashboard, go to **Social Connections**
2. Enable desired providers
3. Configure OAuth apps (follow Clerk's instructions)
4. Users will see social login buttons on Sign In/Up pages

## Passwordless Authentication

Clerk also supports:
- **Email codes**: Users receive a code via email
- **Magic links**: Users click a link in their email
- **SMS OTP**: Users receive a code via SMS

Configure these in the Clerk Dashboard under **Authentication**.

## Troubleshooting

### "Clerk is not initialized"
Make sure you've wrapped your app with `<ClerkProvider>` in the root layout.

### "Webhook signature verification failed"
Ensure your `CLERK_WEBHOOK_SECRET` is correct and matches the one in Clerk Dashboard.

### "clerk_id is null in database"
The webhook may not have fired yet. Check Clerk Dashboard Webhooks section for failures.

### Profile not syncing
Make sure the webhook URL is correct and accessible from the internet (test with webhook tester like webhook.site).

## Next Steps

1. Update authentication pages to use Clerk components
2. Create the webhook endpoint for profile creation
3. Update all user queries to use clerk_id
4. Test social login and passwordless auth
5. Configure email verification and multi-factor authentication
