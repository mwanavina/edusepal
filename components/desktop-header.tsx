'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchBar } from '@/components/search-bar'

export function DesktopHeader() {
  return (
    <header className="hidden md:block border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="px-6 lg:px-8 flex items-center justify-between h-16 gap-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary flex-shrink-0">
          EDUSEPAL
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="ghost" className="text-foreground hover:bg-muted">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
