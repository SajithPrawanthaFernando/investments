"use client";

import { useRef, Suspense } from "react";
// Added useRouter to handle URL updates
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { properties } from "@/data/properties";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const filters = [
  { label: "All Portfolio", value: "all" },
  { label: "Lands", value: "land" },
  { label: "Apartments", value: "apartment" },
  { label: "Houses", value: "house" },
  { label: "Commercial", value: "commercial" },
];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Derive the active filter directly from the URL. No useState needed!
  const activeFilter = searchParams.get("type") || "all";

  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // 2. Filter the data based on the URL parameter
  const filteredProperties = properties.filter((prop) =>
    activeFilter === "all" ? true : prop.type === activeFilter,
  );

  // 3. Function to update the URL when a filter button is clicked
  const handleFilterClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("type"); // Keep the URL clean if "all" is selected
    } else {
      params.set("type", value);
    }
    // Update the URL without scrolling back to the top of the page
    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  useGSAP(
    () => {
      // Animate header once on load
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
      // Re-animate the grid items EVERY time the activeFilter (URL) changes
      if (!gridRef.current) return;

      const cards = gridRef.current.children;
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
    },
    { dependencies: [activeFilter], scope: gridRef },
  );

  return (
    <div className="w-full bg-background min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div ref={headerRef} className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
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
              // Changed onClick to use our new URL routing function
              onClick={() => handleFilterClick(filter.value)}
              className={cn(
                "px-6 py-2 text-sm font-semibold transition-all duration-300",
                activeFilter === filter.value
                  ? "bg-navy text-white"
                  : "bg-surface text-foreground hover:bg-slate-200 dark:hover:bg-white/10",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="group flex flex-col bg-surface overflow-hidden border border-slate-100 dark:border-white/5"
              >
                {/* Image Container */}
                <div className="relative h-[300px] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${property.image})` }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-navy px-3 py-1 text-xs font-bold tracking-widest uppercase shadow-sm">
                      {property.type}
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-foreground mb-3 leading-tight group-hover:text-brand transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-2 text-muted text-sm mb-6">
                    <MapPin size={16} className="text-brand" />
                    <span>{property.location}</span>
                  </div>

                  {property.features && (
                    <p className="text-sm font-medium text-foreground/70 mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                      {property.features}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-xl font-bold text-navy dark:text-white">
                      {property.price}
                    </span>

                    <Link
                      href={`/properties/${property.id}`}
                      className="w-10 h-10 bg-brand text-white flex items-center justify-center hover:bg-navy transition-colors duration-300"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted">
            <p className="text-xl">
              No properties currently match this criteria.
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
