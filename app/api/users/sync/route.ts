import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/users/sync
 * Syncs Clerk user data to Supabase profiles table
 * Called from client-side useSyncUser hook
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { clerkId, email, firstName, lastName, imageUrl } = body

    // Validate required fields
    if (!clerkId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: clerkId and email' },
        { status: 400 }
      )
    }

    // Create Supabase client (server-side)
    const supabase = await createClient()

    // Check if user profile already exists
    const { data: existingProfile, error: selectError } = await supabase
      .from('profiles')
      .select('id, clerk_id')
      .eq('clerk_id', clerkId)
      .single()

    // PGRST116 error code means "no rows found" - expected for new users
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('[Sync] Database select error:', selectError)
      return NextResponse.json(
        { error: 'Database error', details: selectError.message },
        { status: 500 }
      )
    }

    // If profile already exists, return success
    if (existingProfile) {
      console.log('[Sync] User profile already exists:', clerkId)
      return NextResponse.json(
        {
          success: true,
          message: 'User profile already synced',
          profileId: existingProfile.id,
          action: 'existing',
        },
        { status: 200 }
      )
    }

    // Create new user profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        clerk_id: clerkId,
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        profile_image_url: imageUrl || null,
        user_type: 'learner',
        is_email_verified: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error('[Sync] Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create user profile', details: insertError.message },
        { status: 500 }
      )
    }

    console.log('[Sync] New user profile created:', newProfile.id)

    return NextResponse.json(
      {
        success: true,
        message: 'User profile created successfully',
        profileId: newProfile.id,
        action: 'created',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Sync] Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}
