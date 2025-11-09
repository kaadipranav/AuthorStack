'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Check if Supabase is initialized
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        // Test 2: Try to get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          setUser(session.user);
          setStatus('✅ Successfully connected to Supabase and authenticated!');
        } else {
          setStatus('✅ Successfully connected to Supabase! No active session.');
        }
      } catch (error: any) {
        setStatus(`❌ Error: ${error.message}`);
        console.error('Test failed:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Connection Status:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {status}
        </pre>

        {user && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">User Info:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Next Steps:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Check the browser console for detailed logs</li>
            <li>Verify your Supabase project settings</li>
            <li>Ensure CORS is properly configured in Supabase</li>
            <li>Check network requests in the browser's Network tab</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
