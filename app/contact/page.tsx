import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchBar } from '@/components/search-bar'

export default function ContactPage() {
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">support@edusepal.com</p>
                <p className="text-muted-foreground">info@edusepal.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Address</h3>
                <p className="text-muted-foreground">
                  EDUSEPAL Inc.<br />
                  123 Learning Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((platform) => (
                    <Link key={platform} href="#" className="text-primary hover:text-primary/80 font-medium">
                      {platform}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-muted/30 rounded-lg p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <Input 
                  type="text" 
                  placeholder="Your name" 
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <Input 
                  type="text" 
                  placeholder="How can we help?" 
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us more..." 
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How do I reset my password?',
                a: 'Visit the login page and click "Forgot Password?" to reset your password via email.',
              },
              {
                q: 'How can I refund a course?',
                a: 'We offer a 30-day money-back guarantee. Contact our support team to process your refund.',
              },
              {
                q: 'How do I become an instructor?',
                a: 'Apply to become an instructor through our instructor portal. We review applications within 5 business days.',
              },
              {
                q: 'Do you offer certificates?',
                a: 'Yes! Upon course completion, you receive a professional certificate from EDUSEPAL.',
              },
            ].map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
