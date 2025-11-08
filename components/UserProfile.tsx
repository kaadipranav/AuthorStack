'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Button } from './Button';

export function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button href="/auth/login" variant="secondary">
          Log In
        </Button>
        <Button href="/auth/signup" variant="primary">
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">
        {user.email}
      </span>
      <Button onClick={handleLogout} variant="outline">
        Log Out
      </Button>
    </div>
  );
}
