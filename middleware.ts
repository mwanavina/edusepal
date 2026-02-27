// TODO: Re-enable when Clerk is configured
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// // Define protected routes that require authentication
// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)',
//   '/instructor(.*)',
//   '/certificates(.*)',
//   '/api/users/(.*)',
// ])

// export default clerkMiddleware((auth, req) => {
//   // Protect routes that require authentication
//   if (isProtectedRoute(req)) {
//     auth().protect()
//   }
// })

// Temporarily disabled auth middleware
export function middleware() {
    // Pass through all requests for now
  }
  
  export const config = {
    matcher: [
    //   Skip Next.js internals and all static files
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
  