import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchBar } from '@/components/search-bar'

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p>
              EDUSEPAL ("we", "our", or "us") operates the EDUSEPAL website and mobile application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Types of Data Collected:</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Personal Data: Email address, first name, last name, phone number, address, cookies and usage data</li>
              <li>Usage Data: Information about how you access and use the Service (pages visited, time spent, links clicked, etc.)</li>
              <li>Device Information: Device type, operating system, browser type and version</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Use of Data</h2>
            <p>EDUSEPAL uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer care and support</li>
              <li>To gather analysis or valuable information so we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical and security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Security of Data</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: privacy@edusepal.com
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
