import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchBar } from '@/components/search-bar'

const jobListings = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build scalable web applications and contribute to our platform architecture.',
  },
  {
    id: 2,
    title: 'Content Creator & Course Instructor',
    department: 'Content',
    location: 'Remote',
    type: 'Contract',
    description: 'Create engaging courses and educational content for our platform.',
  },
  {
    id: 3,
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Lead product strategy and oversee platform development initiatives.',
  },
  {
    id: 4,
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Remote',
    type: 'Full-time',
    description: 'Analyze user data and provide insights to drive business decisions.',
  },
  {
    id: 5,
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'London, UK',
    type: 'Full-time',
    description: 'Help customers achieve their learning goals and grow with EDUSEPAL.',
  },
  {
    id: 6,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design beautiful and intuitive interfaces for our learning platform.',
  },
]

export default function CareersPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
          <Link href="/" className="text-2xl font-bold text-primary flex-shrink-0">
            EDUSEPAL
          </Link>
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" className="text-foreground hover:bg-muted">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Careers at EDUSEPAL</h1>
          <p className="text-xl text-muted-foreground">
            Join our team and help shape the future of education. We're looking for talented individuals passionate about learning.
          </p>
        </div>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Why Join Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🌍',
                title: 'Global Impact',
                description: 'Make a difference in education for millions of learners worldwide.',
              },
              {
                icon: '🚀',
                title: 'Innovation',
                description: 'Work with cutting-edge technology and creative minds.',
              },
              {
                icon: '🤝',
                title: 'Inclusive Culture',
                description: 'Be part of a diverse, supportive, and growing team.',
              },
            ].map((item, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Job Listings */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Open Positions</h2>
          <div className="space-y-4">
            {jobListings.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline">{job.department}</Badge>
                      <span className="text-sm text-muted-foreground">{job.location}</span>
                      <Badge className="bg-primary/20 text-primary">{job.type}</Badge>
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Apply
                  </Button>
                </div>
                <p className="text-muted-foreground">{job.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/10 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Don't see the right role?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Send us your resume and tell us how you'd like to contribute to EDUSEPAL's mission.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
            Send Your Application
          </Button>
        </section>
      </main>
    </div>
  )
}
