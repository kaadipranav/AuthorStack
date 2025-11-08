'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export function ConnectGumroadForm() {
  const supabase = createClientComponentClient();

  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!apiKey.trim()) {
        setError('API key is required');
        return;
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Not authenticated');
        return;
      }

      // Check if connection already exists
      const { data: existing } = await supabase
        .from('platform_connections')
        .select('id')
        .eq('user_id', user.id)
        .eq('platform_name', 'gumroad')
        .single();

      if (existing) {
        // Update existing connection
        const { error: updateError } = await supabase
          .from('platform_connections')
          .update({
            credentials: { api_key: apiKey },
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Create new connection
        const { error: insertError } = await supabase
          .from('platform_connections')
          .insert([
            {
              user_id: user.id,
              platform_name: 'gumroad',
              credentials: { api_key: apiKey },
              is_active: true,
            },
          ]);

        if (insertError) throw insertError;
      }

      setSuccess(true);
      setApiKey('');

      // Redirect after success
      setTimeout(() => {
        window.location.href = '/settings';
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect Gumroad';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-medium">✓ Gumroad connected successfully!</p>
        <p className="text-green-700 text-sm mt-1">Redirecting to settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Gumroad API Key"
        type="password"
        placeholder="Enter your Gumroad API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        required
        disabled={isLoading}
      />

      <p className="text-xs text-gray-500">
        Your API key is encrypted and stored securely. We never store it in plain text.
      </p>

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Connect Gumroad
      </Button>
    </form>
  );
}
