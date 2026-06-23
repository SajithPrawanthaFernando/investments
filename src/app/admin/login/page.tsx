"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/utils/client";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminLogin() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const supabase = createClient(); // Initialize Supabase

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useGSAP(
    () => {
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef },
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Real Supabase Authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-background flex items-center justify-center p-6 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

      <div
        ref={cardRef}
        className="w-full max-w-[440px] bg-surface border border-white/10 p-8 md:p-12 relative z-10 shadow-2xl shadow-black/50"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block mb-2">
            <span className="text-3xl font-bold tracking-tight text-white">
              Investments<span className="text-brand">.lk</span>
            </span>
          </Link>
          <p className="text-sm font-medium text-white/50 uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 text-center font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-wider text-white/80"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-white/40">
                <Mail size={18} />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@investments.lk"
                className="w-full bg-background border border-white/10 pl-12 pr-5 py-4 text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-white/30"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-wider text-white/80"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-white/40">
                <Lock size={18} />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-white/10 pl-12 pr-5 py-4 text-white outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-white/30"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-4 w-full bg-brand hover:bg-white text-white hover:text-navy py-4 font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-colors duration-300 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                Authenticating <Loader2 size={18} className="animate-spin" />
              </>
            ) : (
              <>
                Secure Login
                <ArrowRight
                  size={18}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-brand transition-colors uppercase tracking-widest font-medium"
          >
            ← Return to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
