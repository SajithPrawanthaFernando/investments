"use client";

import { Building2, Users, Eye, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Properties",
      value: "24",
      change: "+3 this month",
      icon: Building2,
      trend: "up",
    },
    {
      title: "Active Inquiries",
      value: "156",
      change: "+12% from last week",
      icon: Users,
      trend: "up",
    },
    {
      title: "Total Views",
      value: "12.4k",
      change: "+5% from last week",
      icon: Eye,
      trend: "up",
    },
    {
      title: "Avg. Engagement",
      value: "4.2m",
      change: "Steady",
      icon: TrendingUp,
      trend: "neutral",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, Admin
        </h1>
        <p className="text-white/50">
          Here is what's happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-surface border border-white/5 p-6 relative overflow-hidden group hover:border-brand/50 transition-colors duration-300"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-white">
                    {stat.value}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center text-brand">
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-xs font-medium text-brand relative z-10">
                {stat.change}
              </p>

              {/* Decorative accent */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-colors duration-500" />
            </div>
          );
        })}
      </div>

      {/* Placeholder for future charts or recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-white/5 p-8 h-[400px] flex items-center justify-center">
          <p className="text-white/30 font-bold uppercase tracking-widest text-sm">
            Traffic Chart Placeholder
          </p>
        </div>
        <div className="bg-surface border border-white/5 p-8 h-[400px] flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 mb-6">
            Recent Inquiries
          </h3>
          <div className="flex-1 flex items-center justify-center border-t border-white/5">
            <p className="text-white/30 font-bold uppercase tracking-widest text-sm text-center">
              No new inquiries
              <br />
              today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
