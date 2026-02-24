'use client'

import { useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'

/**
 * Client-side hook to sync Clerk user to database
 * This calls the API endpoint which handles database operations server-side
 */
export function useSyncUser() {
  const { user: clerkUser, isLoaded } = useUser()
  const syncAttempted = useRef(false)

  useEffect(() => {
    // Prevent duplicate sync attempts
    if (syncAttempted.current) return
    if (!isLoaded || !clerkUser) return

    syncAttempted.current = true

    const syncUserViaAPI = async () => {
      try {
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl,
          }),
        })

        if (!response.ok) {
          console.error('[User Sync] Error syncing user:', await response.text())
          return
        }

        const data = await response.json()
        console.log('[User Sync] User synced successfully:', data)
      } catch (error) {
        console.error('[User Sync] Error:', error)
      }
    }

    syncUserViaAPI()
  }, [clerkUser?.id, isLoaded])
}
