'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { useUser, SignOutButton } from '@clerk/nextjs'
// import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
// import { useSyncUser } from '@/hooks/use-sync-user'

interface EnrolledCourse {
  id: string
  course_id: string
  status: string
  progress_percentage: number
  lessons_completed: number
  course: {
    id: string
    title: string
    description: string
    level: string
  }
}

export default function DashboardPage() {
  // const { user: clerkUser, isLoaded } = useUser()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  // const supabase = createClient()

  // Sync Clerk user to database
  // useSyncUser()

  useEffect(() => {
    // TODO: Re-enable when Clerk is configured
    // const getEnrolledCourses = async () => {
    //   if (!isLoaded || !clerkUser) {
    //     setLoading(false)
    //     return
    //   }

    //   try {
    //     // Get user profile by clerk_id
    //     const { data: profile, error: profileError } = await supabase
    //       .from('profiles')
    //       .select('id')
    //       .eq('clerk_id', clerkUser.id)
    //       .single()

    //     if (profileError || !profile) {
    //       console.error('Profile not found')
    //       setLoading(false)
    //       return
    //     }

    //     // Fetch enrolled courses
    //     const { data, error } = await supabase
    //       .from('enrollments')
    //       .select('*, course:courses(*)')
    //       .eq('user_id', profile.id)
    //       .eq('status', 'active')

    //     if (error) throw error
    //     setEnrolledCourses(data || [])
    //   } catch (err) {
    //     console.error('Error:', err)
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    // getEnrolledCourses()
    setLoading(false)
  }, [])



  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            EDUSEPAL
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/courses">
              <Button variant="ghost" className="text-foreground hover:bg-muted">
                Courses
              </Button>
            </Link>
            <ThemeToggle />
            {/* <SignOutButton redirectUrl="/">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Sign Out
              </Button>
            </SignOutButton> */}
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Hello, <strong>User</strong> {/* {clerkUser?.emailAddresses[0]?.emailAddress} */}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{enrolledCourses.length}</div>
              <p className="text-muted-foreground">Active Courses</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">0</div>
              <p className="text-muted-foreground">Certificates Earned</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {enrolledCourses.length > 0
                  ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress_percentage || 0), 0) / enrolledCourses.length)
                  : 0}
                %
              </div>
              <p className="text-muted-foreground">Average Progress</p>
            </div>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Courses</h2>
            <Link href="/courses">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore More Courses
              </Button>
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start learning by exploring our course catalog.
                </p>
                <Link href="/courses">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {enrolledCourses.map((enrollment) => (
                <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-br from-primary/30 to-primary/10 h-32 flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-foreground mb-1">{enrollment.course?.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{enrollment.course?.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Progress</span>
                        <span className="text-sm text-muted-foreground">{enrollment.progress_percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress_percentage || 0}%` }}
                        />
                      </div>
                    </div>

                    <Link href={`/courses/${enrollment.course_id}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
