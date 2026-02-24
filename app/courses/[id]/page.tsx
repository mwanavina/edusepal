'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Course {
  id: string
  title: string
  description: string
  level: string
  price: number
  rating: number
  total_students: number
  duration_hours: number
  learning_outcomes: string[]
  prerequisites: string[]
  instructor_id: string
}

interface Module {
  id: string
  title: string
  order_index: number
  duration_hours: number
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [supabase])

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', params.id)
          .single()

        if (courseError) throw courseError
        setCourse(courseData)

        // Fetch modules
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .eq('course_id', params.id)
          .order('order_index')

        if (modulesError) throw modulesError
        setModules(modulesData || [])

        // Check if user is enrolled
        if (user) {
          const { data: enrollmentData } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', params.id)
            .single()

          setEnrolled(!!enrollmentData)
        }
      } catch (err) {
        console.error('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCourse()
    }
  }, [params.id, user, supabase])

  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    setEnrolling(true)
    try {
      const { error } = await supabase.from('enrollments').insert({
        user_id: user.id,
        course_id: params.id,
        status: 'active',
        total_lessons: modules.length,
      })

      if (error) throw error
      setEnrolled(true)
    } catch (err) {
      console.error('Error enrolling:', err)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Course not found</p>
          <Link href="/courses">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Courses
            </Button>
          </Link>
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
          <Link href="/courses">
            <Button variant="ghost" className="text-foreground hover:bg-muted">
              Courses
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/courses" className="text-primary hover:underline mb-6 inline-flex items-center">
          ← Back to Courses
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl h-64 flex items-center justify-center mb-8">
              <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
              </svg>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="capitalize">{course.level}</Badge>
                <span className="text-sm text-muted-foreground">⭐ {course.rating?.toFixed(1) || 'N/A'}</span>
                <span className="text-sm text-muted-foreground">{course.total_students} students</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground">{course.description}</p>
            </div>

            {/* Learning Outcomes */}
            {course.learning_outcomes && course.learning_outcomes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">What you'll learn</h2>
                <ul className="space-y-3">
                  {course.learning_outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-muted-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modules */}
            {modules.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Course Content</h2>
                <div className="space-y-3">
                  {modules.map((module) => (
                    <Card key={module.id} className="p-4 hover:bg-muted transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{module.title}</h3>
                        <span className="text-sm text-muted-foreground">{module.duration_hours || 0}h</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-24">
              <div className="text-center mb-6">
                {course.price > 0 ? (
                  <div className="text-4xl font-bold text-primary mb-2">${course.price}</div>
                ) : (
                  <div className="text-2xl font-bold text-primary mb-2">FREE</div>
                )}
                <p className="text-sm text-muted-foreground">
                  {course.duration_hours ? `${course.duration_hours} hours of content` : 'Self-paced learning'}
                </p>
              </div>

              {enrolled ? (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                    <p className="text-green-700 dark:text-green-200 font-semibold">You're enrolled! 🎉</p>
                  </div>
                  <Link href={`/courses/${course.id}/learn`} className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Go to Course
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-4"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              )}

              <div className="border-t border-border pt-6 mt-6">
                <h3 className="font-semibold text-foreground mb-4">This course includes:</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Video lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Quizzes & assignments
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Certificate of completion
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Lifetime access
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
