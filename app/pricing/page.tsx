import { getCurrentUser, getUserProfile } from '@/lib/auth';
import { UpgradeModal } from '@/components/billing/UpgradeModal';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Check } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Pricing - AuthorStack',
  description: 'Choose the perfect plan for your book business',
};

export default async function PricingPage() {
  const user = await getCurrentUser();
  const profile = await getUserProfile();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '1 book',
        '1 platform connection',
        'Basic dashboard',
        '7 days of data history',
        'Launch checklist',
        'Community support',
      ],
      cta: 'Get Started',
      ctaVariant: 'secondary' as const,
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For growing authors',
      features: [
        'Unlimited books',
        'All platform integrations',
        'Full data history',
        'Competitor tracking (up to 10)',
        'A/B testing',
        'Email alerts',
        'Marketing calendar',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      ctaVariant: 'primary' as const,
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      description: 'For serious publishers',
      features: [
        'Everything in Pro',
        'Unlimited competitor tracking',
        'Custom integrations',
        'White-label reports',
        'API access',
        'Dedicated account manager',
        'Custom workflows',
        'SLA support',
      ],
      cta: 'Upgrade to Enterprise',
      ctaVariant: 'accent' as const,
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your book business. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${
                plan.highlighted ? 'ring-2 ring-accent transform md:scale-105' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="bg-accent text-white px-4 py-2 text-center text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.name === 'Free' ? (
                  <Link href="/auth/signup" className="w-full">
                    <Button variant={plan.ctaVariant} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <UpgradeModal>
                    <Button variant={plan.ctaVariant} className="w-full">
                      {plan.cta}
                    </Button>
                  </UpgradeModal>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Start with our Free plan and upgrade whenever you\'re ready. No credit card required.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards through Whop. Your payment information is secure and encrypted.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 30-day money-back guarantee on all paid plans. No questions asked.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely! Cancel your subscription at any time. Your data remains accessible for 30 days.',
              },
              {
                q: 'Do you offer discounts for annual billing?',
                a: 'Contact our sales team for custom pricing on annual plans and enterprise agreements.',
              },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {user && profile?.subscription_tier === 'free' && (
          <div className="mt-16 bg-gradient-to-r from-primary to-blue-700 text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to grow your book business?</h3>
            <p className="mb-6 text-blue-100">
              Upgrade to Pro today and unlock all the tools you need to succeed.
            </p>
            <UpgradeModal>
              <Button variant="accent" size="lg">
                Upgrade Now
              </Button>
            </UpgradeModal>
          </div>
        )}
      </div>
    </div>
  );
}
