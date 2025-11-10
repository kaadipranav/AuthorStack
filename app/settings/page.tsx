import { redirect } from 'next/navigation';
import { getCurrentUser, getUserProfile } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { SyncButton } from '@/components/platforms/SyncButton';
import Link from 'next/link';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Settings - AuthorStack',
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const profile = await getUserProfile();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Verified
                </label>
                <p className="text-gray-900">
                  {user.email_confirmed_at ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-600">⚠ Pending</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Plan
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold capitalize text-primary">
                    {profile?.subscription_tier}
                  </span>
                  {profile?.subscription_tier === 'free' && (
                    <Link href="/pricing">
                      <Button variant="primary" size="sm">
                        Upgrade
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {profile?.subscription_tier !== 'free' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing
                  </label>
                  <p className="text-gray-600 text-sm mb-2">
                    Manage your subscription and billing information through Whop.
                  </p>
                  {profile?.whop_customer_id ? (
                    <a
                      href={`https://whop.com/account/subscriptions`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" size="sm" className="mt-2">
                        Manage Billing
                      </Button>
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      Billing management will be available after your subscription is activated.
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">Connect your sales platforms and sync data.</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Gumroad</h4>
                <Link href="/platforms/connect">
                  <Button variant="secondary" className="w-full">
                    Connect / Manage Gumroad
                  </Button>
                </Link>
              </div>
              <div>
                <h4 className="font-medium mb-2">Amazon KDP</h4>
                <Button variant="secondary" className="w-full" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              Manually sync your sales data from connected platforms.
            </p>
            <SyncButton />
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              Permanently delete your account and all associated data.
            </p>
            <Button variant="danger">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
