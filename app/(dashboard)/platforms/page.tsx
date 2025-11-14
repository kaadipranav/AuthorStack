'use client';

import { useState } from 'react';
import { Plug, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/Button';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  category: 'sales' | 'marketing' | 'analytics' | 'tools';
}

const integrations: Integration[] = [
  {
    id: 'amazon-kdp',
    name: 'Amazon KDP',
    description: 'Connect your Amazon Kindle Direct Publishing account',
    icon: '📚',
    connected: true,
    category: 'sales',
  },
  {
    id: 'gumroad',
    name: 'Gumroad',
    description: 'Sync sales and customer data from Gumroad',
    icon: '🎁',
    connected: false,
    category: 'sales',
  },
  {
    id: 'apple-books',
    name: 'Apple Books',
    description: 'Connect your Apple Books for Authors account',
    icon: '🍎',
    connected: false,
    category: 'sales',
  },
  {
    id: 'google-play',
    name: 'Google Play Books',
    description: 'Integrate Google Play Books for Authors',
    icon: '🎮',
    connected: false,
    category: 'sales',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Connect your email marketing campaigns',
    icon: '📧',
    connected: false,
    category: 'marketing',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track website traffic and user behavior',
    icon: '📊',
    connected: false,
    category: 'analytics',
  },
];

export default function IntegrationsPage() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(
    new Set(integrations.filter(i => i.connected).map(i => i.id))
  );

  const handleConnect = (id: string) => {
    const newConnected = new Set(connectedIntegrations);
    if (newConnected.has(id)) {
      newConnected.delete(id);
    } else {
      newConnected.add(id);
    }
    setConnectedIntegrations(newConnected);
  };

  const categories = ['sales', 'marketing', 'analytics', 'tools'] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Plug className="w-8 h-8 text-burgundy" />
          <h1 className="font-heading text-4xl font-bold text-ink">Integrations</h1>
        </div>
        <p className="text-charcoal">Connect your favorite tools to AuthorStack</p>
      </div>

      {/* Integrations by Category */}
      {categories.map(category => {
        const categoryIntegrations = integrations.filter(i => i.category === category);
        if (categoryIntegrations.length === 0) return null;

        return (
          <div key={category}>
            <h2 className="font-heading text-2xl font-bold text-ink mb-4 capitalize">
              {category === 'tools' ? 'Tools & Utilities' : category}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryIntegrations.map(integration => (
                <div
                  key={integration.id}
                  className="bg-surface border border-stroke rounded-card p-6 hover:shadow-elevated transition-smooth"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{integration.icon}</div>
                    {connectedIntegrations.has(integration.id) && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-forest/10 rounded text-xs font-semibold text-forest">
                        <Check size={14} />
                        <span>Connected</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-ink mb-2">{integration.name}</h3>
                  <p className="text-sm text-charcoal mb-4">{integration.description}</p>

                  <Button
                    variant={connectedIntegrations.has(integration.id) ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleConnect(integration.id)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {connectedIntegrations.has(integration.id) ? (
                      <>
                        <Check size={16} />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <ExternalLink size={16} />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Coming Soon */}
      <div className="bg-glass border border-stroke rounded-card p-6 text-center">
        <p className="text-charcoal">More integrations coming soon! Have a suggestion?</p>
        <a href="mailto:support@authorstack.com" className="text-burgundy font-medium hover:underline">
          Let us know
        </a>
      </div>
    </div>
  );
}
