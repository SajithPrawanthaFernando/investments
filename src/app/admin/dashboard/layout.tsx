"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/utils/client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const sidebarLinks = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/admin/dashboard/properties", icon: Building2 },
  { name: "Inquiries", href: "/admin/dashboard/inquiries", icon: Users },
  { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter(); // Added useRouter
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Supabase Logout Handler
  const handleLogout = async () => {
    const supabase = createClient();

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Redirect to login and refresh router state to clear caches
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background overflow-hidden selection:bg-brand selection:text-white">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-white/5 transform transition-transform duration-300 ease-in-out flex flex-col lg:relative lg:translate-x-0",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Sidebar Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
            <Link href="/admin/dashboard" className="flex items-center gap-1">
              <span className="text-xl font-bold tracking-tight text-white">
                Admin<span className="text-brand">Panel</span>
              </span>
            </Link>
            <button
              className="lg:hidden text-white/50 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                    isActive
                      ? "bg-brand/10 text-brand border-r-2 border-brand"
                      : "text-white/50 hover:text-white hover:bg-white/5 border-r-2 border-transparent",
                  )}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer (Logout) */}
          <div className="p-4 border-t border-white/5">
            {/* CRITICAL FIX: Changed <Link> to <button> with an onClick handler */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors duration-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="h-20 bg-background/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-30">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-white/70 hover:text-white"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-bold text-white hidden sm:block">
                {sidebarLinks.find((l) => l.href === pathname)?.name ||
                  "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-white/50 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full" />
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                <div className="w-8 h-8 bg-brand text-white flex items-center justify-center font-bold text-sm">
                  A
                </div>
                <div className="hidden md:block text-sm">
                  <p className="font-bold text-white leading-none">
                    Admin User
                  </p>
                  <p className="text-white/50 text-xs mt-1">Superadmin</p>
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-10">
            <div className="max-w-[1200px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
