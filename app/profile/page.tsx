import { redirect } from 'next/navigation';
import { getCurrentUser, getUserProfile } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { LogoutButton } from '@/components/auth/LogoutButton';
import Link from 'next/link';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Profile - AuthorStack',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const profile = await getUserProfile();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <p className="font-mono text-sm text-gray-600">{user.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Verified
                </label>
                <p className="text-gray-900">
                  {user.email_confirmed_at ? (
                    <span className="text-green-600 font-medium">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">⚠ Pending</span>
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Created
                </label>
                <p className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {profile && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription Tier
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold capitalize text-primary">
                      {profile.subscription_tier}
                    </span>
                    {profile.subscription_tier === 'free' && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Upgrade Available
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard">
                <Button variant="secondary" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
