'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs } from '@/components/ui/tabs'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
  })
  const [pendingCourses, setPendingCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getAdmin = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single()

        if (profile?.user_type !== 'admin') {
          router.push('/dashboard')
          return
        }

        setUser(user)

        // Fetch stats
        const [usersRes, coursesRes, enrollmentsRes, certificatesRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact' }),
          supabase.from('courses').select('id', { count: 'exact' }),
          supabase.from('enrollments').select('id', { count: 'exact' }),
          supabase.from('certificates').select('id', { count: 'exact' }),
        ])

        setStats({
          totalUsers: usersRes.count || 0,
          totalCourses: coursesRes.count || 0,
          totalEnrollments: enrollmentsRes.count || 0,
          totalCertificates: certificatesRes.count || 0,
        })

        // Fetch pending courses for moderation
        const { data: courses } = await supabase
          .from('courses')
          .select('*, instructor:profiles(id, first_name, last_name, email)')
          .eq('status', 'draft')
          .limit(10)

        setPendingCourses(courses || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    getAdmin()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const approveCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: 'published' })
        .eq('id', courseId)

      if (error) throw error

      setPendingCourses(pendingCourses.filter((c) => c.id !== courseId))
    } catch (err) {
      console.error('Error approving course:', err)
    }
  }

  const rejectCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: 'draft' })
        .eq('id', courseId)

      if (error) throw error

      setPendingCourses(pendingCourses.filter((c) => c.id !== courseId))
    } catch (err) {
      console.error('Error rejecting course:', err)
    }
  }

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
          <div className="flex gap-4">
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200 h-fit">
              Admin
            </Badge>
            <Button onClick={handleLogout} variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform activity and manage content</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Users</p>
            <div className="text-3xl font-bold text-primary">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-2">Registered users</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Courses</p>
            <div className="text-3xl font-bold text-primary">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-2">Published & draft</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Enrollments</p>
            <div className="text-3xl font-bold text-primary">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground mt-2">Active enrollments</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm mb-2">Certificates Issued</p>
            <div className="text-3xl font-bold text-primary">{stats.totalCertificates}</div>
            <p className="text-xs text-muted-foreground mt-2">Earned certificates</p>
          </Card>
        </div>

        {/* Moderation */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Course Moderation</h2>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200">
              {pendingCourses.length} pending
            </Badge>
          </div>

          {pendingCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">All courses have been reviewed!</p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                View Published Courses
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCourses.map((course) => (
                <div key={course.id} className="border border-border rounded-lg p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    </div>
                    <Badge className="capitalize">{course.level}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Instructor</p>
                      <p className="text-sm text-foreground font-medium">
                        {course.instructor?.first_name} {course.instructor?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{course.instructor?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="text-sm text-foreground">
                        {new Date(course.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-sm text-foreground font-medium">
                        {course.price > 0 ? `$${course.price}` : 'Free'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => approveCourse(course.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => rejectCourse(course.id)}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                      Request Changes
                    </Button>
                    <Button variant="outline" className="border-border hover:bg-muted">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
