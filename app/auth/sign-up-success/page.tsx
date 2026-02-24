'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Email</h1>
              <p className="text-muted-foreground text-sm">
                We've sent a verification link to your email address. Please check your inbox and click the link to confirm your account.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                <strong>Didn't receive the email?</strong> Check your spam folder or <button className="underline font-medium">resend the link</button>.
              </p>
            </div>

            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 h-auto">
                Return to Sign In
              </Button>
            </Link>

            <p className="text-xs text-muted-foreground">
              Once verified, you'll be able to log in and access your courses.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
