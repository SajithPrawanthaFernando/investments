"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Building,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form States (Simulated Data)
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@investments.lk",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [platform, setPlatform] = useState({
    whatsapp: "+94 11 234 5678",
    supportEmail: "invest@investments.lk",
    address: "Level 12, West Tower, World Trade Center, Colombo 01",
    websiteActive: true,
  });

  // Simulated Save Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      // Reset passwords after save
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
          <p className="text-white/50 text-sm">
            Manage your account and platform configurations.
          </p>
        </div>

        {/* Global Save Action */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand hover:bg-white text-white hover:text-navy px-8 py-3 font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-colors duration-300 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">Saving...</span>
          ) : saveSuccess ? (
            <span className="flex items-center gap-2 text-green-400 group-hover:text-green-600">
              <CheckCircle2 size={18} /> Saved
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save size={18} /> Save Changes
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Security */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Settings */}
          <div className="bg-surface border border-white/5 p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <User className="text-brand" size={20} />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                Admin Profile
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full bg-background border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full bg-background border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-surface border border-white/5 p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <Lock className="text-brand" size={20} />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                Security
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Current Password
                </label>
                <input
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full bg-background border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors placeholder:text-white/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                  New Password
                </label>
                <input
                  type="password"
                  value={security.newPassword}
                  onChange={(e) =>
                    setSecurity({ ...security, newPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full bg-background border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors placeholder:text-white/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full bg-background border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors placeholder:text-white/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Configuration */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface border border-white/5 p-8 relative overflow-hidden h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <Building className="text-brand" size={20} />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                Platform Configuration
              </h2>
            </div>

            <div className="space-y-8">
              <p className="text-white/50 text-sm">
                These details are displayed publicly on the website's contact
                pages and footer. Updating them here will instantly change them
                across the platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WhatsApp Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                    <Phone size={14} /> Official Contact Number
                  </label>
                  <input
                    type="text"
                    value={platform.whatsapp}
                    onChange={(e) =>
                      setPlatform({ ...platform, whatsapp: e.target.value })
                    }
                    className="w-full bg-background border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors"
                  />
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">
                    Used for WhatsApp inquiries
                  </p>
                </div>

                {/* Support Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                    <Mail size={14} /> Support Email
                  </label>
                  <input
                    type="email"
                    value={platform.supportEmail}
                    onChange={(e) =>
                      setPlatform({ ...platform, supportEmail: e.target.value })
                    }
                    className="w-full bg-background border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              {/* Office Address */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <MapPin size={14} /> Corporate Address
                </label>
                <textarea
                  rows={3}
                  value={platform.address}
                  onChange={(e) =>
                    setPlatform({ ...platform, address: e.target.value })
                  }
                  className="w-full bg-background border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors resize-none"
                />
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                    <Globe size={16} className="text-brand" /> Public Website
                    Status
                  </h3>
                  <p className="text-xs text-white/50">
                    Toggle off to put the public portfolio into maintenance
                    mode.
                  </p>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  onClick={() =>
                    setPlatform({
                      ...platform,
                      websiteActive: !platform.websiteActive,
                    })
                  }
                  className={cn(
                    "relative w-14 h-7 transition-colors duration-300",
                    platform.websiteActive ? "bg-brand" : "bg-white/10",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-5 h-5 bg-white transition-transform duration-300",
                      platform.websiteActive ? "left-8" : "left-1",
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
