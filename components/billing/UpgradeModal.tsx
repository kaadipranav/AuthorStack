'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { X } from 'lucide-react';

interface UpgradeModalProps {
  children: ReactNode;
}

export function UpgradeModal({ children }: UpgradeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async (plan: 'pro' | 'enterprise') => {
    setSelectedPlan(plan);
    setIsProcessing(true);
    setError(null);

    try {
      // Call Whop checkout API
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.checkoutUrl) {
        // Redirect to Whop checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Pro Plan */}
                <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-accent transition">
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <p className="text-3xl font-bold text-primary mb-4">
                    $19<span className="text-lg text-gray-600">/month</span>
                  </p>

                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      Unlimited books
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      All platform integrations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      Competitor tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      A/B testing
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      Email alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      Marketing calendar
                    </li>
                  </ul>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleUpgrade('pro')}
                    isLoading={isProcessing && selectedPlan === 'pro'}
                  >
                    Upgrade to Pro
                  </Button>
                </div>

                {/* Enterprise Plan */}
                <div className="border-2 border-accent rounded-lg p-6 relative">
                  <div className="absolute -top-3 left-4 bg-accent text-white px-3 py-1 rounded text-xs font-semibold">
                    MOST POPULAR
                  </div>

                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <p className="text-3xl font-bold text-accent mb-4">
                    $49<span className="text-lg text-gray-600">/month</span>
                  </p>

                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      Everything in Pro
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      Custom integrations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      White-label reports
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      API access
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      Dedicated support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      Priority onboarding
                    </li>
                  </ul>

                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={() => handleUpgrade('enterprise')}
                    isLoading={isProcessing && selectedPlan === 'enterprise'}
                  >
                    Upgrade to Enterprise
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-900">
                  <p>
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p>
                  <strong>Note:</strong> You will be redirected to Whop to complete your payment.
                  Your subscription will be activated immediately after payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
