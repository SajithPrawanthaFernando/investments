"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/utils/client";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const filters = [
  { label: "All Portfolio", value: "all" },
  { label: "Lands", value: "lands" },
  { label: "Houses", value: "houses" },
  { label: "Apartments", value: "apartments" },
  { label: "Commercial", value: "commercial" },
];

function PropertiesContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Derive the active filter type directly from the browser URL search params
  const activeFilter = searchParams.get("type") || "all";

  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // --- FETCH PUBLIC LISTINGS FROM SUPABASE ---
  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      setIsLoading(true);

      // Fetch data where status is NOT inactive (hidden from the public)
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .neq("status", "inactive")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProperties(data);
      }
      setIsLoading(false);
    };

    fetchPublicPortfolio();
  }, [supabase]);

  // --- FILTER LOCAL RECORDS BY ACTIVE TAB ---
  const filteredProperties = properties.filter((prop) =>
    activeFilter === "all"
      ? true
      : prop.type?.toLowerCase() === activeFilter.toLowerCase(),
  );

  // --- ROUTING / FILTER CLICKS ---
  const handleFilterClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  // --- GSAP ANIMATIONS ---
  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    },
    { scope: headerRef },
  );

  useGSAP(
    () => {
      if (!gridRef.current || isLoading) return;

      const cards = gridRef.current.children;
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            overwrite: "auto",
          },
        );
      }
    },
    { dependencies: [activeFilter, isLoading], scope: gridRef },
  );

  // Helper formatting utility for displaying premium textual tags for statuses
  const renderStatusBadge = (status: string) => {
    if (!status || status === "active") return null;

    const configurations: Record<string, string> = {
      under_offer: "bg-yellow-500 text-navy border-yellow-600",
      sold: "bg-brand text-white border-brand",
      rented: "bg-purple-500 text-white border-purple-600",
    };

    const labels: Record<string, string> = {
      under_offer: "Under Offer",
      sold: "Sold Portfolio",
      rented: "Leased / Rented",
    };

    return (
      <span
        className={cn(
          "absolute bottom-4 left-4 border px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-sm",
          configurations[status] || "bg-white text-navy border-white",
        )}
      >
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="w-full bg-background min-h-screen md:pt-40 pt-36  md:pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div ref={headerRef} className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Exclusive <br />
            <span className="text-brand">Opportunities.</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Browse our curated portfolio of premium real estate across Sri
            Lanka. Filter by asset class to find your next major investment.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-surface pb-6">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterClick(filter.value)}
              className={cn(
                "px-6 py-2 text-sm font-semibold transition-all duration-300 border border-transparent",
                activeFilter === filter.value
                  ? "bg-brand text-white"
                  : "bg-surface text-foreground hover:bg-white/10",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Dynamic State Layout Render */}
        {isLoading ? (
          <div className="py-24 text-center text-muted flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
            <p className="text-sm font-bold uppercase tracking-widest opacity-60">
              Synchronizing Real Estate Feed...
            </p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredProperties.map((property) => {
              // Read the first index of the images text array as the primary card image
              const primaryImage =
                property.images && property.images.length > 0
                  ? property.images[0]
                  : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop";

              return (
                <div
                  key={property.id}
                  className="group flex flex-col bg-surface overflow-hidden border border-white/5 relative shadow-xl shadow-black/10"
                >
                  {/* Image Container */}
                  <div className="relative h-[300px] overflow-hidden bg-background">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${primaryImage})` }}
                    />

                    {/* Primary Asset Class Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-navy px-3 py-1 text-xs font-bold tracking-widest uppercase shadow-sm">
                        {property.type}
                      </span>
                    </div>

                    {/* Conditional Premium Context Status Tag (Sold, Under Offer, Rented) */}
                    {renderStatusBadge(property.status)}
                  </div>

                  {/* Content Block */}
                  <div className="p-8 flex flex-col flex-grow relative">
                    <h3 className="text-2xl font-bold text-foreground mb-3 leading-tight group-hover:text-brand transition-colors">
                      {property.title}
                    </h3>

                    {/* Clickable Location Link */}
                    <div className="flex items-center gap-2 text-muted text-sm mb-6">
                      <MapPin size={16} className="text-brand shrink-0" />
                      {property.locationUrl ? (
                        <a
                          href={property.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white hover:underline underline-offset-4 transition-all duration-300 truncate"
                          title="View on Google Maps"
                        >
                          {property.location}
                        </a>
                      ) : (
                        <span className="truncate">{property.location}</span>
                      )}
                    </div>

                    {property.description && (
                      <p className="text-sm font-medium text-foreground/70 mb-6 pb-6 border-b border-white/10 line-clamp-2 h-11">
                        {property.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* LKR Format Wrapper */}
                      <span className="text-xl font-bold text-white flex items-baseline gap-1">
                        <span className="text-sm text-brand">LKR</span>
                        {property.price?.replace(/^\$/, "")}
                      </span>

                      <Link
                        href={`/properties/${property.id}`}
                        className="w-10 h-10 hover:bg-white hover:text-navy bg-brand text-white flex items-center justify-center transition-colors duration-300"
                      >
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-muted border border-white/5 bg-surface/50">
            <p className="text-xl font-medium">
              No exclusive investment opportunities match this portfolio
              criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PropertiesContent />
    </Suspense>
  );
}
