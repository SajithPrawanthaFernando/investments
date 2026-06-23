"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Building,
  Home,
  Loader2,
  ArrowRight,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to format ISO dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

export default function AdminDashboard() {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalProperties: 0,
    activeInquiries: 0,
    totalInvestors: 0,
    totalListers: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);

  // New state for our custom chart
  const [portfolioStats, setPortfolioStats] = useState({
    active: 0,
    under_offer: 0,
    sold: 0,
    rented: 0,
  });

  // State to trigger the CSS width animation after load
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      try {
        // Fetch properties (We grab the status to build the chart)
        const { data: propertiesData } = await supabase
          .from("properties")
          .select("status");

        const totalProps = propertiesData?.length || 0;

        // Aggregate statuses for the chart
        const pStats = { active: 0, under_offer: 0, sold: 0, rented: 0 };
        propertiesData?.forEach((p) => {
          if (p.status === "active") pStats.active++;
          if (p.status === "under_offer") pStats.under_offer++;
          if (p.status === "sold") pStats.sold++;
          if (p.status === "rented") pStats.rented++;
        });

        // Fetch unread inquiries
        const { count: unreadCount } = await supabase
          .from("inquiries")
          .select("*", { count: "exact", head: true })
          .eq("status", "unread");

        // Fetch total investor leads
        const { count: investorsCount } = await supabase
          .from("inquiries")
          .select("*", { count: "exact", head: true })
          .eq("type", "invest");

        // Fetch total property lister leads
        const { count: listersCount } = await supabase
          .from("inquiries")
          .select("*", { count: "exact", head: true })
          .eq("type", "list");

        // Fetch latest 5 inquiries for the sidebar
        const { data: latestInquiries } = await supabase
          .from("inquiries")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setMetrics({
          totalProperties: totalProps,
          activeInquiries: unreadCount || 0,
          totalInvestors: investorsCount || 0,
          totalListers: listersCount || 0,
        });

        setPortfolioStats(pStats);

        if (latestInquiries) {
          setRecentInquiries(latestInquiries);
        }

        // Trigger the CSS animation slightly after data loads
        setTimeout(() => setAnimateChart(true), 100);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  const stats = [
    {
      title: "Total Properties",
      value: metrics.totalProperties.toString(),
      change: "Live Portfolio",
      icon: Building2,
    },
    {
      title: "Unread Inquiries",
      value: metrics.activeInquiries.toString(),
      change: "Requires Attention",
      icon: Users,
    },
    {
      title: "Investor Leads",
      value: metrics.totalInvestors.toString(),
      change: "Looking to buy",
      icon: Building,
    },
    {
      title: "Lister Leads",
      value: metrics.totalListers.toString(),
      change: "Looking to sell",
      icon: Home,
    },
  ];

  // Calculate percentages safely for the chart
  const getPercentage = (val: number) => {
    if (metrics.totalProperties === 0) return 0;
    return Math.round((val / metrics.totalProperties) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-white/50">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
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
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-colors duration-500" />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CUSTOM VISUALIZATION: Portfolio Status Breakdown */}
        <div className="lg:col-span-2 bg-surface border border-white/5 p-8 h-[450px] flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-3 ">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Portfolio Status Distribution
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Real-time breakdown of asset flow
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            {/* Active (Available) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-green-400">Available (Active)</span>
                <span className="text-white">
                  {portfolioStats.active} (
                  {getPercentage(portfolioStats.active)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-green-500/80 transition-all duration-1000 ease-out"
                  style={{
                    width: animateChart
                      ? `${getPercentage(portfolioStats.active)}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            {/* Under Offer */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-yellow-400">Under Offer</span>
                <span className="text-white">
                  {portfolioStats.under_offer} (
                  {getPercentage(portfolioStats.under_offer)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-yellow-500/80 transition-all duration-1000 ease-out delay-100"
                  style={{
                    width: animateChart
                      ? `${getPercentage(portfolioStats.under_offer)}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            {/* Sold */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-brand">Closed / Sold</span>
                <span className="text-white">
                  {portfolioStats.sold} ({getPercentage(portfolioStats.sold)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-brand transition-all duration-1000 ease-out delay-200"
                  style={{
                    width: animateChart
                      ? `${getPercentage(portfolioStats.sold)}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            {/* Rented */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-purple-400">Leased / Rented</span>
                <span className="text-white">
                  {portfolioStats.rented} (
                  {getPercentage(portfolioStats.rented)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-purple-500/80 transition-all duration-1000 ease-out delay-300"
                  style={{
                    width: animateChart
                      ? `${getPercentage(portfolioStats.rented)}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Recent Inquiries Feed */}
        <div className="bg-surface border border-white/5 h-[450px] flex flex-col relative overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface z-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Recent Inquiries
            </h3>
            <Link
              href="/admin/dashboard/inquiries"
              className="text-xs text-brand hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto">
            {recentInquiries.length > 0 ? (
              <div className="divide-y divide-white/5">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="p-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sm text-white">
                        {inquiry.name}
                      </p>
                      <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                        {formatDate(inquiry.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60 mb-3">
                      {inquiry.type === "invest" ? (
                        <span className="text-brand flex items-center gap-1 font-bold">
                          <Building size={12} /> INVESTOR
                        </span>
                      ) : (
                        <span className="text-purple-400 flex items-center gap-1 font-bold">
                          <Home size={12} /> LISTER
                        </span>
                      )}
                      <span className="opacity-50">•</span>
                      <span className="truncate">{inquiry.category}</span>
                    </div>
                    <Link
                      href="/admin/dashboard/inquiries"
                      className="text-xs font-bold text-white/40 hover:text-brand flex items-center gap-1 transition-colors w-fit"
                    >
                      Read message <ArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <p className="text-white/30 font-bold uppercase tracking-widest text-sm">
                  No new inquiries
                  <br />
                  today
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
