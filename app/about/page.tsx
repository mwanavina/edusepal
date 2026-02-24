import { MobileHeader } from '@/components/mobile-header'
import { DesktopHeader } from '@/components/desktop-header'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <MobileHeader />
      <DesktopHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">About EDUSEPAL</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
            We're on a mission to democratize quality education and make learning accessible to everyone, everywhere.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-4">
            EDUSEPAL exists to empower individuals with knowledge, skills, and certifications that advance their careers and transform their lives. We believe education should be accessible, affordable, and high-quality for everyone.
          </p>
          <p className="text-lg text-muted-foreground">
            Through our platform, we connect passionate instructors with eager learners worldwide, creating a community dedicated to continuous growth and professional excellence.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Accessibility',
                description: 'Education should be available to everyone, regardless of location or background.',
              },
              {
                title: 'Quality',
                description: 'We maintain the highest standards for course content, instructors, and student experience.',
              },
              {
                title: 'Innovation',
                description: 'We continuously improve our platform with cutting-edge technology and teaching methods.',
              },
              {
                title: 'Community',
                description: 'We foster a supportive environment where learners and instructors can grow together.',
              },
            ].map((value, i) => (
              <Card key={i} className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16 bg-primary/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Active Learners</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <p className="text-muted-foreground">Expert Instructors</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Courses Available</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to join us?</h2>
          <Link href="/auth/sign-up">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Start Learning Today
            </Button>
          </Link>
        </section>
      </main>
    </div>
  )
}
