import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ConnectGumroadForm } from '@/components/platforms/ConnectGumroadForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import Link from 'next/link';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Connect Platform - AuthorStack',
};

export default async function ConnectPlatformPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <div className="mb-8">
          <Link href="/settings">
            <Button variant="secondary" size="sm">
              ← Back to Settings
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Connect Sales Platform</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Gumroad */}
          <Card>
            <CardHeader>
              <CardTitle>Gumroad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-6">
                Connect your Gumroad account to sync sales data automatically.
              </p>
              <ConnectGumroadForm />
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle>Amazon KDP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-6">
                Amazon KDP integration coming soon.
              </p>
              <Button variant="secondary" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Get Your Gumroad API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li>
                <strong>1. Go to Gumroad Settings</strong>
                <p className="text-gray-600">Visit https://gumroad.com/settings/account</p>
              </li>
              <li>
                <strong>2. Find API Token</strong>
                <p className="text-gray-600">Scroll to "API Token" section</p>
              </li>
              <li>
                <strong>3. Copy Token</strong>
                <p className="text-gray-600">Click to copy your API token</p>
              </li>
              <li>
                <strong>4. Paste in Form</strong>
                <p className="text-gray-600">Paste the token in the form above</p>
              </li>
              <li>
                <strong>5. Connect</strong>
                <p className="text-gray-600">Click "Connect Gumroad" to save</p>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Security Note */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🔒 Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800">
              Your API key is encrypted and stored securely. We never store it in plain text.
              You can revoke access anytime from your Gumroad settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
