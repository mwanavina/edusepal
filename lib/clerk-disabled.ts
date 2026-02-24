/**
 * Clerk Stub - Used when Clerk is disabled for development
 * This prevents errors from missing Clerk configuration
 */

// Mock hooks that return dummy values when Clerk is not configured
export const useUser = () => ({
  user: null,
  isLoaded: true,
  isSignedIn: false,
})

export const useAuth = () => ({
  userId: null,
  isLoaded: true,
  isSignedIn: false,
})

export const SignOutButton = ({ children }: { children: React.ReactNode }) => <>{children}</>

// Re-export for convenience
export { SignOutButton } from '@clerk/nextjs'
