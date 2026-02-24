import { MobileHeader } from '@/components/mobile-header'
import { DesktopHeader } from '@/components/desktop-header'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for exploring and getting started',
    features: [
      'Access to 50+ free courses',
      'Basic course materials',
      'Community forum access',
      'No certificate',
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$9.99',
    period: '/month',
    description: 'Best for serious learners',
    features: [
      'Access to 500+ premium courses',
      'Download course materials',
      'Professional certificates',
      'Priority support',
      'Ad-free experience',
      'Lifetime access to courses',
    ],
    highlighted: true,
  },
  {
    name: 'Business',
    price: 'Custom',
    description: 'For organizations and teams',
    features: [
      'Team access (10+ members)',
      'Custom learning paths',
      'Admin dashboard',
      'Advanced analytics',
      'Dedicated account manager',
      'Custom integrations',
    ],
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="bg-background min-h-screen">
      <MobileHeader />
      <DesktopHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Choose the perfect plan for your learning journey. Cancel anytime, no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {pricingPlans.map((plan, i) => (
            <Card 
              key={i} 
              className={`p-8 flex flex-col ${plan.highlighted ? 'ring-2 ring-primary md:scale-105 relative' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <Button 
                className={`mb-8 w-full py-6 font-semibold ${
                  plan.highlighted 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                    : 'border-2 border-primary text-primary hover:bg-primary/10'
                }`}
              >
                Get Started
              </Button>
              <div className="space-y-4">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Feature Comparison</h2>
          <Card className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-foreground">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-foreground">Starter</th>
                  <th className="px-6 py-4 text-center font-semibold text-foreground">Professional</th>
                  <th className="px-6 py-4 text-center font-semibold text-foreground">Business</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Courses Access', starter: '50+', professional: '500+', business: 'All' },
                  { feature: 'Certificates', starter: 'No', professional: 'Yes', business: 'Yes' },
                  { feature: 'Download Materials', starter: 'No', professional: 'Yes', business: 'Yes' },
                  { feature: 'Support', starter: 'Community', professional: 'Priority', business: 'Dedicated' },
                  { feature: 'Lifetime Access', starter: 'No', professional: 'Yes', business: 'Yes' },
                  { feature: 'Team Access', starter: 'No', professional: 'No', business: 'Yes' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                    <td className="px-6 py-4 text-foreground font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.starter}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.professional}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Pricing FAQs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'Is there a free trial?',
                a: 'The Starter plan is completely free with access to 50+ courses. No trial period needed!',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and various regional payment methods.',
              },
              {
                q: 'Do you offer discounts for annual billing?',
                a: 'Yes! Pay annually and save 20% on Professional and Business plans.',
              },
            ].map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary/10 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to start learning?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of learners and start your journey today.
          </p>
          <Link href="/auth/sign-up">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Get Started Free
            </Button>
          </Link>
        </section>
      </main>
    </div>
  )
}
