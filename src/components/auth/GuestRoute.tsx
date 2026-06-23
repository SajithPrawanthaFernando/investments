"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/client";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if there is an active session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Session found! They shouldn't be here. Kick them to the dashboard.
        router.replace("/admin/dashboard");
      } else {
        // No session found. Let them see the login page.
        setIsGuest(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, supabase]);

  // Show the loader to prevent a flash of the login screen before the redirect
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-white/50">
          Checking Session...
        </p>
      </div>
    );
  }

  // If they are logged in, render nothing while the router redirects them
  if (!isGuest) {
    return null;
  }

  // If they are a true guest, render the login page
  return <>{children}</>;
}
