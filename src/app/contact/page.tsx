"use client";

import { useRef, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Building,
  Home,
  Loader2,
} from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/utils/client"; // Import Supabase client

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize Supabase
  const supabase = createClient();

  // 1. State Management
  const [userType, setUserType] = useState<"invest" | "list">("invest");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    message: "",
  });

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 2. Database Insertion & WhatsApp Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step A: Save the lead to the Supabase database
      const { error } = await supabase.from("inquiries").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: userType,
          category: formData.category,
          message: formData.message,
          status: "unread", // Default status for the admin dashboard
        },
      ]);

      if (error) throw error;

      // Step B: Format and Redirect to WhatsApp
      const whatsappMessage = `*New Inquiry via Investments.lk*

*Type:* ${userType === "invest" ? "Looking to Invest" : "Listing a Property"}
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Property Category:* ${formData.category}

*Additional Details:*
${formData.message || "No additional details provided."}`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappNumber = "94769363695";

      // Clear the form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        message: "",
      });

      // Redirect to WhatsApp
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
        "_blank",
      );
    } catch (error: any) {
      alert(
        "Something went wrong while submitting your inquiry. Please try again or contact us directly.",
      );
      console.error("Submission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // GSAP Animations
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(leftColumnRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      });

      tl.from(
        formRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
        },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="w-full bg-background min-h-screen md:pt-40 pt-36 md:pb-24"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Direct Contact Details */}
          <div ref={leftColumnRef} className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-8">
              Let's discuss your <br />{" "}
              <span className="text-brand">next investment.</span>
            </h1>
            <p className="text-lg text-muted mb-12 max-w-md">
              Whether you are looking to acquire a high-yield asset or list a
              premium property, our acquisitions team is ready to assist you.
            </p>

            <div className="space-y-8 border-t border-surface pt-12">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface flex items-center justify-center text-brand shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-1">
                    Corporate Office
                  </h4>
                  <p className="text-foreground font-medium text-lg">
                    Level 12, West Tower,
                    <br />
                    World Trade Center,
                    <br />
                    Colombo 01, Sri Lanka
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface flex items-center justify-center text-brand shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-1">
                    Direct Line
                  </h4>
                  <a
                    href="tel:+94112345678"
                    className="text-foreground font-medium text-lg hover:text-brand transition-colors"
                  >
                    +94 11 234 5678
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface flex items-center justify-center text-brand shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-1">
                    General Inquiries
                  </h4>
                  <a
                    href="mailto:invest@investments.lk"
                    className="text-foreground font-medium text-lg hover:text-brand transition-colors"
                  >
                    invest@investments.lk
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Inquiry Form */}
          <div className="bg-surface p-8 md:p-12 lg:p-16">
            {/* User Type Toggle */}
            <div className="flex gap-4 mb-10 border-b border-white/10 pb-6">
              <button
                type="button"
                onClick={() => setUserType("invest")}
                className={cn(
                  "flex-1 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300",
                  userType === "invest"
                    ? "bg-brand text-white"
                    : "bg-background text-muted hover:text-foreground",
                )}
              >
                <Building size={18} className="hidden sm:block" /> I want to
                Invest
              </button>
              <button
                type="button"
                onClick={() => setUserType("list")}
                className={cn(
                  "flex-1 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300",
                  userType === "list"
                    ? "bg-brand text-white"
                    : "bg-background text-muted hover:text-foreground",
                )}
              >
                <Home size={18} className="hidden sm:block" /> List Property
              </button>
            </div>

            <form
              ref={formRef}
              className="flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-bold uppercase tracking-wider text-foreground"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-background border border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-muted/50"
                  required
                />
              </div>

              {/* Grid for Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-bold uppercase tracking-wider text-foreground"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-background border border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-muted/50"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-bold uppercase tracking-wider text-foreground"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className="w-full bg-background border border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-muted/50"
                    required
                  />
                </div>
              </div>

              {/* Asset Class Interest / Listing Category */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="category"
                  className="text-sm font-bold uppercase tracking-wider text-foreground"
                >
                  {userType === "invest" ? "Primary Interest" : "Property Type"}
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-background border border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 appearance-none rounded-none"
                    required
                  >
                    <option value="" disabled>
                      Select an asset class...
                    </option>
                    <option value="Exclusive Lands">Exclusive Lands</option>
                    <option value="Luxury Apartments">Luxury Apartments</option>
                    <option value="Residential Houses">
                      Residential Houses
                    </option>
                    <option value="Commercial Buildings">
                      Commercial Buildings
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-muted">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-bold uppercase tracking-wider text-foreground"
                >
                  Additional Details
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder={
                    userType === "invest"
                      ? "Tell us about your investment criteria or timeline..."
                      : "Provide a brief description of the property you want to list..."
                  }
                  className="w-full bg-background border border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-muted/50 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-4 w-full hover:bg-white hover:text-navy bg-brand text-white py-5 font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    Processing <Loader2 size={20} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Submit Inquiry
                    <ArrowRight
                      size={20}
                      className="transform group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
