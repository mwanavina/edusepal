import { createClient } from '@/lib/supabase/server'

/**
 * Sync Clerk user to Supabase after successful authentication
 * This creates or updates a user profile in the database
 */
export async function syncClerkUserToDatabase(
  clerkId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string
) {
  const supabase = createClient()

  try {
    // Check if user profile already exists
    const { data: existingUser, error: selectError } = await supabase
      .from('profiles')
      .select('id, clerk_id')
      .eq('clerk_id', clerkId)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = "not found" which is expected for new users
      throw selectError
    }

    // If user doesn't exist, create profile
    if (!existingUser) {
      const { error: insertError } = await supabase.from('profiles').insert({
        clerk_id: clerkId,
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        profile_image_url: imageUrl || null,
        role: 'learner', // default role
        bio: null,
        headline: null,
        website: null,
        is_verified: false,
        email_verified: true,
        phone_number: null,
        phone_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error('[Clerk Sync] Error creating profile:', insertError)
        throw insertError
      }

      console.log('[Clerk Sync] Profile created successfully for:', clerkId)
      return { success: true, action: 'created' }
    }

    // If user exists, update their profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        profile_image_url: imageUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', clerkId)

    if (updateError) {
      console.error('[Clerk Sync] Error updating profile:', updateError)
      throw updateError
    }

    console.log('[Clerk Sync] Profile updated successfully for:', clerkId)
    return { success: true, action: 'updated' }
  } catch (error) {
    console.error('[Clerk Sync] Unexpected error:', error)
    throw error
  }
}

/**
 * Handle Clerk user deletion - remove from database
 */
export async function handleClerkUserDeletion(clerkId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('clerk_id', clerkId)

    if (error) {
      console.error('[Clerk Sync] Error deleting profile:', error)
      throw error
    }

    console.log('[Clerk Sync] Profile deleted successfully for:', clerkId)
    return { success: true }
  } catch (error) {
    console.error('[Clerk Sync] Unexpected error during deletion:', error)
    throw error
  }
}

/**
 * Get or create user profile from Clerk data
 */
export async function getOrCreateUserProfile(clerkId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data || null
  } catch (error) {
    console.error('[Clerk Sync] Error fetching user profile:', error)
    return null
  }
}
