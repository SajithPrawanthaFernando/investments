"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { name: "Lands", href: "/properties?type=lands" },
  { name: "Houses", href: "/properties?type=houses" },
  { name: "Apartments", href: "/properties?type=apartments" },
  { name: "Commercial", href: "/properties?type=commercial" },
  { name: "Expertise", href: "/expertise" },
];

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // If we scroll down more than 20px, trigger the solid state
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    },
    { scope: navRef },
  );

  return (
    <header
      ref={navRef}
      className={cn(
        // Changed to 'fixed' to overlay the hero image
        "fixed top-0 z-50 w-full transition-all duration-300",
        // Logic for background and border states
        isMobileMenuOpen
          ? "bg-navy border-b border-white/10" // Solid when mobile menu is open
          : isScrolled
            ? "bg-navy/80 backdrop-blur-lg border-b border-white/10 shadow-lg" // Frosted glass when scrolled
            : "bg-transparent border-transparent", // Transparent at the very top
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 z-50 relative">
          <span className="text-2xl font-bold tracking-tight text-white">
            Investments<span className="text-brand">.lk</span>
          </span>
        </Link>

        {/* Desktop Navigation (Centered) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const [linkPath, linkQuery] = link.href.split("?");
            const typeParam = linkQuery
              ? new URLSearchParams(linkQuery).get("type")
              : null;

            const isActive = typeParam
              ? pathname === linkPath && searchParams.get("type") === typeParam
              : pathname === linkPath;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors hover:text-brand",
                  "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100",
                  isActive
                    ? "text-brand after:scale-x-100"
                    : "text-white/90 hover:text-white",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA (Right) */}
        <div className="hidden md:block z-50 relative">
          <Link
            href="/contact"
            className="bg-brand text-white px-8 py-3 text-sm font-semibold hover:bg-white hover:text-navy  transition-colors duration-300 inline-block"
          >
            Contact us
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white z-50 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 h-screen flex flex-col items-center justify-start pt-50 pb-10 gap-8 overflow-y-auto transition-transform duration-500 ease-in-out md:hidden",
          "bg-navy",
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full",
        )}
      >
        {navLinks.map((link) => {
          const [linkPath, linkQuery] = link.href.split("?");
          const typeParam = linkQuery
            ? new URLSearchParams(linkQuery).get("type")
            : null;
          const isActive = typeParam
            ? pathname === linkPath && searchParams.get("type") === typeParam
            : pathname === linkPath;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-2xl font-medium transition-colors",
                isActive ? "text-brand" : "text-white hover:text-brand",
              )}
            >
              {link.name}
            </Link>
          );
        })}
        <Link
          href="/contact"
          onClick={() => setIsMobileMenuOpen(false)}
          className="bg-brand text-white px-12 py-4 text-lg font-semibold mt-4"
        >
          Contact us
        </Link>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 w-full bg-transparent" />}>
      <NavbarContent />
    </Suspense>
  );
}
