"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaChevronUp,
} from "react-icons/fa6";

const footerLinks = [
  {
    category: "Properties",
    links: [
      { name: "Lands", href: "/properties?type=land" },
      { name: "Apartments", href: "/properties?type=apartment" },
      { name: "Houses", href: "/properties?type=house" },
      { name: "Commercial", href: "/properties?type=commercial" },
    ],
  },
  {
    category: "Company",
    links: [
      { name: "Expertise", href: "/expertise" },
      { name: "Contact us", href: "/contact" },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-background pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* The List-Based Links Section */}
        <div className="flex flex-col mb-16">
          {footerLinks.map((section, index) => (
            <div
              key={section.category}
              className={`flex flex-col md:flex-row md:items-center py-8 border-b border-white/10 ${
                index === 0 ? "border-t" : ""
              }`}
            >
              {/* Category Title */}
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <h3 className="text-lg font-medium text-foreground">
                  {section.category}
                </h3>
              </div>

              {/* Links */}
              <div className="w-full md:w-2/3 flex flex-wrap gap-x-8 gap-y-4">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-muted hover:text-brand transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright, Socials, & Scroll to Top */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted text-center md:text-left">
            © Copyright {new Date().getFullYear()} Investments.lk. All Rights
            Reserved.
          </p>

          {/* Social Icons & Back to Top Container */}
          <div className="flex items-center gap-8">
            {/* Socials */}
            <div className="flex items-center gap-6 text-foreground">
              <a href="#" className="hover:text-brand transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                <FaYoutube size={20} />
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="hover:text-brand transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-slate-400 hover:bg-brand text-white flex items-center justify-center transition-colors duration-300"
              aria-label="Scroll to top"
            >
              <FaChevronUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
