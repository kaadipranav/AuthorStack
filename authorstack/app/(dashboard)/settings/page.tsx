import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings',
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-h2 text-ink">Settings</h1>
        <p className="text-body text-charcoal mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile */}
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="p-4 bg-glass rounded-lg">
              <p className="text-muted-foreground">Profile settings placeholder</p>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Integrations</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-stroke rounded-lg">
              <div>
                <div className="font-semibold">Amazon KDP</div>
                <div className="text-small text-muted-foreground">Not connected</div>
              </div>
              <button className="px-4 py-2 text-small border border-stroke rounded-lg hover:bg-glass">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-stroke rounded-lg">
              <div>
                <div className="font-semibold">Gumroad</div>
                <div className="text-small text-muted-foreground">Not connected</div>
              </div>
              <button className="px-4 py-2 text-small border border-stroke rounded-lg hover:bg-glass">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-stroke rounded-lg">
              <div>
                <div className="font-semibold">Apple Books</div>
                <div className="text-small text-muted-foreground">Not connected</div>
              </div>
              <button className="px-4 py-2 text-small border border-stroke rounded-lg hover:bg-glass">
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Billing</h2>
          <div className="p-4 bg-glass rounded-lg">
            <p className="text-muted-foreground">Billing settings placeholder - Stripe integration</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="p-6 bg-surface rounded-lg shadow-elevated">
          <h2 className="font-heading text-h3 text-ink mb-4">Preferences</h2>
          <div className="p-4 bg-glass rounded-lg">
            <p className="text-muted-foreground">User preferences placeholder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
