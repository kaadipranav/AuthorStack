"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    (async () => {
      try {
        // Parse and store the session from the URL (works with Supabase hosted callback)
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

        if (error) {
          console.error("[auth/callback] getSessionFromUrl error:", error);
          setMessage("Authentication failed. Redirecting to login...");
          setTimeout(() => (window.location.href = "/auth/login?error=auth_failed"), 1200);
          return;
        }

        if (data?.session) {
          // Session stored successfully — go to dashboard
          window.location.href = "/dashboard";
        } else {
          // No session in the URL — fallback to login
          console.warn("[auth/callback] no session returned from getSessionFromUrl");
          setMessage("Authentication incomplete. Redirecting to login...");
          setTimeout(() => (window.location.href = "/auth/login?error=auth_failed"), 800);
        }
      } catch (err: any) {
        console.error("[auth/callback] unexpected error:", err);
        setMessage("Unexpected error. Redirecting to login...");
        setTimeout(() => (window.location.href = "/auth/login?error=auth_failed"), 800);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-base text-muted">{message}</p>
      </div>
    </div>
  );
}
