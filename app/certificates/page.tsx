import { MobileHeader } from '@/components/mobile-header'
import { DesktopHeader } from '@/components/desktop-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CertificatesPage() {
  return (
    <div className="bg-background min-h-screen">
      <MobileHeader />
      <DesktopHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">Professional Certificates</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Earn recognized credentials that showcase your skills to employers worldwide
          </p>
        </div>

        {/* Benefits Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">Why Get Certified?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎓',
                title: 'Industry Recognized',
                description: 'Certificates are valued by leading companies and recognized globally.',
              },
              {
                icon: '💼',
                title: 'Career Growth',
                description: 'Boost your resume and demonstrate expertise to potential employers.',
              },
              {
                icon: '🔐',
                title: 'Verified Credentials',
                description: 'Each certificate is digitally signed and verifiable with unique codes.',
              },
            ].map((benefit, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Certificate Categories */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">Certificate Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                category: 'Programming & Development',
                certificates: [
                  'Python Fundamentals',
                  'Full Stack Web Development',
                  'React Advanced Patterns',
                  'Cloud Computing Essentials',
                ],
              },
              {
                category: 'Data & Analytics',
                certificates: [
                  'Data Science Foundations',
                  'Business Analytics',
                  'Machine Learning Basics',
                  'SQL Mastery',
                ],
              },
              {
                category: 'Business & Management',
                certificates: [
                  'Project Management',
                  'Leadership Skills',
                  'Digital Marketing',
                  'Financial Analysis',
                ],
              },
              {
                category: 'Creative & Design',
                certificates: [
                  'UI/UX Design',
                  'Graphic Design',
                  'Video Production',
                  'Content Creation',
                ],
              },
            ].map((section, i) => (
              <Card key={i} className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">{section.category}</h3>
                <ul className="space-y-3">
                  {section.certificates.map((cert, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span className="text-muted-foreground">{cert}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">How to Earn Your Certificate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Enroll in a Course',
                description: 'Choose from 500+ professional courses across multiple categories.',
              },
              {
                step: '2',
                title: 'Complete Coursework',
                description: 'Learn at your own pace and complete all course modules and assignments.',
              },
              {
                step: '3',
                title: 'Pass the Final Exam',
                description: 'Demonstrate your knowledge by passing the comprehensive final exam.',
              },
              {
                step: '4',
                title: 'Receive Certificate',
                description: 'Get your digital certificate instantly and download it anytime.',
              },
            ].map((item, i) => (
              <Card key={i} className="p-6">
                <div className="text-4xl font-bold text-primary mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Certificates */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">Popular Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Full Stack Web Developer',
                duration: '12 weeks',
                students: '10,500+',
                difficulty: 'Intermediate',
              },
              {
                title: 'Data Science Professional',
                duration: '16 weeks',
                students: '8,200+',
                difficulty: 'Advanced',
              },
              {
                title: 'Digital Marketing Specialist',
                duration: '8 weeks',
                students: '6,800+',
                difficulty: 'Beginner',
              },
            ].map((cert, i) => (
              <Card key={i} className="p-6 flex flex-col">
                <div className="bg-gradient-to-br from-primary/30 to-primary/10 rounded h-32 mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{cert.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4 flex-1">
                  <p>Duration: {cert.duration}</p>
                  <p>Students: {cert.students}</p>
                  <p>Level: <Badge variant="outline">{cert.difficulty}</Badge></p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Explore Course
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary/10 rounded-lg p-6 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to boost your career?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            Start earning recognized certificates today and stand out in your field.
          </p>
          <Link href="/courses">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Browse Courses
            </Button>
          </Link>
        </section>
      </main>
    </div>
  )
}
