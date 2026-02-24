import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { syncClerkUserToDatabase, handleClerkUserDeletion } from '@/lib/clerk-sync'

/**
 * Clerk Webhook Handler
 * This endpoint receives events from Clerk when users are created, updated, or deleted
 * 
 * To set up:
 * 1. Go to https://dashboard.clerk.com/apps/[your-app-id]/integrations/webhooks
 * 2. Create a new endpoint pointing to: https://yourapp.com/api/webhooks/clerk
 * 3. Subscribe to: user.created, user.updated, user.deleted
 * 4. Copy the Signing Secret and add to CLERK_WEBHOOK_SECRET env var
 */

export async function POST(req: Request) {
  try {
    const headersList = headers()
    const payload = await req.text()

    // Get the headers for verification
    const svix_id = headersList.get('svix-id')
    const svix_timestamp = headersList.get('svix-timestamp')
    const svix_signature = headersList.get('svix-signature')

    // Error if missing headers
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error: Missing Svix headers', {
        status: 400,
      })
    }

    // Create new Webhook instance with signing secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')

    let evt: any

    // Verify payload with Clerk signing secret
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as any
    } catch (err) {
      console.error('[Clerk Webhook] Error verifying webhook:', err)
      return new Response('Error: Could not verify webhook', {
        status: 400,
      })
    }

    const eventType = evt.type
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data

      // Get primary email
      const primaryEmail =
        email_addresses.find((email: any) => email.id === evt.data.primary_email_address_id)?.email_address ||
        email_addresses[0]?.email_address

      await syncClerkUserToDatabase(id, primaryEmail, first_name, last_name, image_url)

      console.log('[Clerk Webhook] User created:', id)
      return new Response('User created successfully', { status: 200 })
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data

      // Get primary email
      const primaryEmail =
        email_addresses.find((email: any) => email.id === evt.data.primary_email_address_id)?.email_address ||
        email_addresses[0]?.email_address

      await syncClerkUserToDatabase(id, primaryEmail, first_name, last_name, image_url)

      console.log('[Clerk Webhook] User updated:', id)
      return new Response('User updated successfully', { status: 200 })
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data

      await handleClerkUserDeletion(id)

      console.log('[Clerk Webhook] User deleted:', id)
      return new Response('User deleted successfully', { status: 200 })
    }

    // Ignore other event types
    return new Response(`Ignored event type: ${eventType}`, { status: 200 })
  } catch (error) {
    console.error('[Clerk Webhook] Error processing event:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
