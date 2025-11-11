"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Signing you in...");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log("[auth/callback] Auth state change:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        // User successfully signed in
        setMessage("Authentication successful! Redirecting to dashboard...");
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        setMessage("Signed out. Redirecting to login...");
        setTimeout(() => {
          router.push('/auth/login');
        }, 1000);
      }
    });

    // Also try to get the current session
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error("[auth/callback] getSession error:", error);
        setMessage(`Authentication error: ${error.message}`);
        setTimeout(() => {
          router.push('/auth/login?error=auth_failed');
        }, 2000);
      } else if (data.session) {
        // Already have a session
        console.log("[auth/callback] Existing session found");
        router.push('/dashboard');
      } else {
        // No session yet, wait for the OAuth flow to complete
        console.log("[auth/callback] No session yet, waiting for OAuth flow");
        setMessage("Waiting for authentication to complete...");
        
        // Set a timeout to redirect if no session is established
        setTimeout(() => {
          if (mounted) {
            setMessage("Authentication taking too long. Redirecting to login...");
            setTimeout(() => {
              router.push('/auth/login?error=timeout');
            }, 1000);
          }
        }, 10000); // 10 second timeout
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-base text-muted">{message}</p>
      </div>
    </div>
  );
}