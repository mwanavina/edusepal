import { MobileHeader } from '@/components/mobile-header'
import { DesktopHeader } from '@/components/desktop-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HeroCarousel } from '@/components/hero-carousel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="bg-background">
      <MobileHeader />
      <DesktopHeader />

      {/* Hero Carousel Section - Full Width */}
      <section className="w-full py-0 mt-0">
        <HeroCarousel />
      </section>

      {/* Featured Subjects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Explore top <span className="text-primary">subjects</span> & Courses
            </h2>
          </div>

          <div id="courses" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Linear Programming: Secondary school Mathematics',
                likes: '12,348',
                students: '5000',
                duration: '2hrs',
              },
              {
                title: 'Linear Programming: Secondary school Mathematics',
                likes: '12,348',
                students: '5000',
                duration: '2hrs',
              },
              {
                title: 'Linear Programming: Secondary school Mathematics',
                likes: '12,348',
                students: '5000',
                duration: '2hrs',
              },
            ].map((course, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-primary/30 to-primary/10 h-40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-3 line-clamp-2">{course.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{course.likes} liked this topic</p>
                    <p>{course.duration}</p>
                    <p>{course.students} learners enrolled</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="#courses">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                See more courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="bg-primary/10 rounded-2xl h-60 sm:h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12a5 5 0 1110 0 5 5 0 01-10 0z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">Student Success Story</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Learn together. Lead together.
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform connects dedicated learners with expert instructors. Gain practical skills and industry-recognized certifications that advance your career.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-muted-foreground">Highly rated by learners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to advance your skills?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of learners discovering new opportunities and achieving their goals.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white hover:bg-white/90 text-primary font-semibold text-base px-8">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">EDUSEPAL</h3>
              <p className="text-sm text-muted-foreground">
                Empowering learners worldwide with quality education and professional certifications.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
                <li><Link href="/certificates" className="hover:text-primary transition-colors">Certificates</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal & Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EDUSEPAL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
