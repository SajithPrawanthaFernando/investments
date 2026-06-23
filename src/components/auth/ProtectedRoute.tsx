"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/client";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if there is an active session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // No session found? Kick them to the login page immediately.
        router.replace("/admin/login");
      } else {
        // Session found! Let them in.
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, supabase]);

  // Show a premium full-screen loader while checking their credentials
  // This prevents the "flash" of the dashboard before they get kicked out
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-white/50">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  // If they aren't authorized, render nothing (the router.replace is already handling the redirect)
  if (!isAuthorized) {
    return null;
  }

  // If they pass the check, render the actual dashboard content!
  return <>{children}</>;
}
