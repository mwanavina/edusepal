import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Get the current authenticated user from Clerk
 * Server-side only - use in API routes and server actions
 */
export async function getCurrentClerkUser() {
  try {
    const clerkUser = await currentUser()
    return clerkUser
  } catch (error) {
    console.error('[Clerk] Error getting current user:', error)
    return null
  }
}

/**
 * Get Clerk auth session
 * Server-side only - use in API routes and server actions
 */
export async function getClerkSession() {
  try {
    const session = await auth()
    return session
  } catch (error) {
    console.error('[Clerk] Error getting session:', error)
    return null
  }
}

/**
 * Sync Clerk user to database on first login
 * Server-side only function
 */
export async function syncClerkUserToDB(clerkUser: any) {
  if (!clerkUser) return null

  try {
    const supabase = await createClient()

    // Check if user exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_id', clerkUser.id)
      .single()

    // If user exists, return the profile
    if (existingProfile) {
      return existingProfile
    }

    // Create new profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        clerk_id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        first_name: clerkUser.firstName,
        last_name: clerkUser.lastName,
        profile_image_url: clerkUser.imageUrl,
        user_type: 'learner',
        is_email_verified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
      })
      .select()
      .single()

    if (insertError) {
      console.error('[Clerk Sync] Error creating profile:', insertError)
      throw insertError
    }

    console.log('[Clerk Sync] Profile created for:', clerkUser.id)
    return newProfile
  } catch (error) {
    console.error('[Clerk Sync] Unexpected error:', error)
    return null
  }
}
