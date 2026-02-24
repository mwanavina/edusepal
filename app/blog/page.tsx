import { MobileHeader } from '@/components/mobile-header'
import { DesktopHeader } from '@/components/desktop-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const blogPosts = [
  {
    id: 1,
    title: 'How to Master Python in 30 Days',
    excerpt: 'A comprehensive guide to learning Python programming fundamentals from scratch.',
    category: 'Programming',
    date: 'Jan 15, 2024',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: 'The Future of Online Learning',
    excerpt: 'Exploring how AI and technology are transforming the education landscape.',
    category: 'Education',
    date: 'Jan 10, 2024',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'Career Growth: Tips for Skill Development',
    excerpt: 'Strategic approaches to continuous learning and professional advancement.',
    category: 'Career',
    date: 'Jan 5, 2024',
    readTime: '7 min read',
  },
  {
    id: 4,
    title: 'Web Development Trends in 2024',
    excerpt: 'Latest frameworks, tools, and best practices shaping web development.',
    category: 'Technology',
    date: 'Dec 28, 2023',
    readTime: '10 min read',
  },
  {
    id: 5,
    title: 'Student Success Stories: From Zero to Hero',
    excerpt: 'Inspiring journeys of learners who transformed their careers with EDUSEPAL.',
    category: 'Stories',
    date: 'Dec 20, 2023',
    readTime: '9 min read',
  },
  {
    id: 6,
    title: 'The Importance of Continuous Learning',
    excerpt: 'Why lifelong learning is essential in the modern job market.',
    category: 'Education',
    date: 'Dec 15, 2023',
    readTime: '5 min read',
  },
]

export default function BlogPage() {
  return (
    <div className="bg-background min-h-screen">
      <MobileHeader />
      <DesktopHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Stay updated with insights, tips, and stories from the EDUSEPAL community.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="bg-gradient-to-br from-primary/30 to-primary/10 h-48 flex items-center justify-center">
                <svg className="w-16 h-16 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                </svg>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  <Button variant="ghost" className="text-primary hover:bg-primary/10">
                    Read More →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
