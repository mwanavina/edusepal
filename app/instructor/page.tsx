'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { useUser, SignOutButton } from '@clerk/nextjs'
// import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
// import { useSyncUser } from '@/hooks/use-sync-user'

interface InstructorCourse {
  id: string
  title: string
  status: string
  total_students: number
  total_modules: number
  rating: number
}

export default function InstructorPage() {
  // const { user: clerkUser, isLoaded } = useUser()
  const [courses, setCourses] = useState<InstructorCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()
  // const supabase = createClient()

  // Sync Clerk user to database
  // useSyncUser()

  useEffect(() => {
    // TODO: Re-enable when Clerk is configured
    // const getInstructor = async () => {
    //   if (!isLoaded || !clerkUser) {
    //     setLoading(false)
    //     return
    //   }

    //   try {
    //     // Get user profile by clerk_id
    //     const { data: profile, error: profileError } = await supabase
    //       .from('profiles')
    //       .select('*')
    //       .eq('clerk_id', clerkUser.id)
    //       .single()

    //     if (profileError || !profile) {
    //       router.push('/auth/login')
    //       return
    //     }

    //     if (profile.user_type !== 'instructor') {
    //       router.push('/dashboard')
    //       return
    //     }

    //     setUserProfile(profile)

    //     // Fetch instructor's courses
    //     const { data: coursesData } = await supabase
    //       .from('courses')
    //       .select('*')
    //       .eq('instructor_id', profile.id)
    //       .order('created_at', { ascending: false })

    //     setCourses(coursesData || [])
    //   } catch (err) {
    //     console.error('Error:', err)
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    // getInstructor()
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
            <Link href="/dashboard">
              <Button variant="ghost" className="text-foreground hover:bg-muted">
                Back to Dashboard
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
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and track student progress</p>
          </div>
          <Link href="/instructor/create-course">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              + Create Course
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Courses</p>
            <div className="text-3xl font-bold text-primary">{courses.length}</div>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Students</p>
            <div className="text-3xl font-bold text-primary">
              {courses.reduce((sum, c) => sum + (c.total_students || 0), 0)}
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Average Rating</p>
            <div className="text-3xl font-bold text-primary">
              {courses.length > 0
                ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
                : '0.0'}
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Published Courses</p>
            <div className="text-3xl font-bold text-primary">
              {courses.filter((c) => c.status === 'published').length}
            </div>
          </Card>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Courses</h2>

          {courses.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first course to start teaching students.
                </p>
                <Link href="/instructor/create-course">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Create Your First Course
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                        <Badge className="capitalize">{course.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {course.total_students} students • {course.total_modules} modules • ⭐ {course.rating?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/instructor/courses/${course.id}`}>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                          Edit
                        </Button>
                      </Link>
                      <Button variant="outline" className="border-border hover:bg-muted">
                        View
                      </Button>
                    </div>
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
