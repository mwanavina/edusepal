'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { TiptapEditor } from '@/components/tiptap-editor'

interface FormData {
  title: string
  description: string
  rich_description: string
  level: string
  category_id: string
  pricing_type: string
  price: number
}

export default function CreateCoursePage() {
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    rich_description: '',
    level: 'beginner',
    category_id: '',
    pricing_type: 'free',
    price: 0,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        // TODO: Re-enable auth check when Clerk is configured
        // const {
        //   data: { user },
        // } = await supabase.auth.getUser()

        // if (!user) {
        //   router.push('/auth/login')
        //   return
        // }

        // setUser({ id: 'temp-user' })

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)

        setCategories(categoriesData || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      // TODO: Use real user.id when auth is re-enabled
      const userId = 'temp-instructor-id'

      const { data, error: insertError } = await supabase
        .from('courses')
        .insert({
          title: formData.title,
          slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description,
          rich_description: formData.rich_description,
          level: formData.level,
          category_id: formData.category_id || null,
          instructor_id: userId,
          pricing_type: formData.pricing_type,
          price: formData.pricing_type === 'free' ? 0 : formData.price,
          status: 'draft',
        })
        .select()

      if (insertError) throw insertError

      router.push(`/instructor/courses/${data[0].id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
    } finally {
      setSubmitting(false)
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/instructor" className="text-2xl font-bold text-primary">
            EDUSEPAL
          </Link>
          <Link href="/instructor">
            <Button variant="ghost" className="text-foreground hover:bg-muted">
              Back
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create a New Course</h1>
          <p className="text-muted-foreground">
            Fill in the basic information about your course. You can add content and modules after creation.
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Course Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Web Development Fundamentals"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Course Description (Short) *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what students will learn in this course..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="rich-description" className="text-sm font-medium">
                Course Description (Detailed)
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Add rich content with formatting, lists, images, and links</p>
              <TiptapEditor
                value={formData.rich_description}
                onChange={(value) => setFormData({ ...formData, rich_description: value })}
                placeholder="Provide detailed course information..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level" className="text-sm font-medium">
                  Level *
                </Label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricingType" className="text-sm font-medium">
                  Pricing Type *
                </Label>
                <select
                  id="pricingType"
                  value={formData.pricing_type}
                  onChange={(e) => setFormData({ ...formData, pricing_type: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {formData.pricing_type === 'paid' && (
                <div>
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price ($) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="49.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    className="mt-2"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                {submitting ? 'Creating...' : 'Create Course'}
              </Button>
              <Link href="/instructor">
                <Button type="button" variant="outline" className="border-border hover:bg-muted">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
