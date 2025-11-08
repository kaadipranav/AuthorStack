'use client';

import { ReactNode } from 'react';
import { UpgradeModal } from '@/components/billing/UpgradeModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';

interface BillingGateProps {
  children: ReactNode;
  requiredTier: 'pro' | 'enterprise';
  userTier: string;
  featureName: string;
}

export function BillingGate({
  children,
  requiredTier,
  userTier,
  featureName,
}: BillingGateProps) {
  const hasAccess =
    userTier === 'pro' ||
    userTier === 'enterprise' ||
    (requiredTier === 'pro' && userTier === 'enterprise');

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <Card className="border-2 border-accent">
      <CardHeader>
        <CardTitle className="text-accent">🔒 Premium Feature</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          <strong>{featureName}</strong> is available on the Pro plan and above.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Upgrade your account to unlock this feature and get access to all premium tools.
        </p>
        <UpgradeModal>
          <Button variant="accent" className="w-full">
            Upgrade to Pro
          </Button>
        </UpgradeModal>
      </CardContent>
    </Card>
  );
}
