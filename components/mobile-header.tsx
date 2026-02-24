'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Header - visible on small screens */}
      <header className="md:hidden border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary flex-1 text-center mx-4">
            EDUSEPAL
          </Link>

          {/* Search Icon */}
          <Link href="/search" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Search className="h-6 w-6 text-foreground" />
          </Link>
        </div>

        {/* Mobile Menu - slides down when open */}
        {isOpen && (
          <div className="border-t border-border bg-background animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-2 p-4">
              {/* Navigation Links */}
              <Link
                href="/courses"
                className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>

              <div className="border-t border-border my-2 pt-2">
                {/* Theme Toggle */}
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <ThemeToggle />
                </div>

                {/* Sign In */}
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>

                {/* Get Started */}
                <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
