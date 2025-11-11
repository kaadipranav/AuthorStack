"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Signing you in...");
  const [details, setDetails] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(window.location.href);

    // detectSessionInUrl=true in our client config will parse hash fragments automatically
    // We subscribe to auth state changes and also poll once for an existing session
    const { data: sub } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session) {
        window.location.href = "/dashboard";
      }
    });

    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("[auth/callback] getSession error:", error);
        setMessage("Authentication failed on callback.");
        setDetails(error.message || String(error));
        return;
      }
      if (data?.session) {
        window.location.href = "/dashboard";
      } else {
        // Give the client a moment to parse the URL and store the session
        setTimeout(async () => {
          const { data: d2 } = await supabase.auth.getSession();
          if (d2?.session) {
            window.location.href = "/dashboard";
          } else {
            setMessage("Waiting for OAuth session...");
            setDetails("No session present. Current URL: " + window.location.href);
          }
        }, 300);
      }
    })();

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-base text-muted">{message}</p>
        {details && (
          <>
            <pre className="mt-4 text-left text-xs bg-black/5 p-3 rounded">{details}</pre>
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={() => (window.location.href = "/auth/login?error=auth_failed&msg=" + encodeURIComponent(details))}
                className="px-4 py-2 rounded bg-gray-800 text-white"
              >
                Back to login
              </button>
            </div>
          </>
        )}
        {!details && url && (
          <pre className="mt-4 text-left text-xs bg-black/5 p-3 rounded">URL: {url}</pre>
        )}
      </div>
    </div>
  );
}
