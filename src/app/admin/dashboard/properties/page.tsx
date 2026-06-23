"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simulated initial data
const initialProperties = [
  {
    id: "1",
    title: "Oceanview Luxury Villa",
    type: "Houses",
    price: "$1,250,000",
    location: "Galle, Sri Lanka",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Colombo City Center Apartment",
    type: "Apartments",
    price: "$450,000",
    location: "Colombo 02",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Prime Commercial Plot",
    type: "Lands",
    price: "$2,100,000",
    location: "Kandy City",
    status: "inactive",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop",
  },
];

export default function AdminProperties() {
  const [properties, setProperties] = useState(initialProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter properties based on search
  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Toggle Active/Inactive Status
  const toggleStatus = (id: string) => {
    setProperties(
      properties.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: p.status === "active" ? "inactive" : "active",
          };
        }
        return p;
      }),
    );
  };

  // Delete Property
  const deleteProperty = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this property? This cannot be undone.",
      )
    ) {
      setProperties(properties.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Properties</h1>
          <p className="text-white/50 text-sm">
            Manage your real estate portfolio.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand hover:bg-white text-white hover:text-navy px-6 py-3 font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-colors duration-300"
        >
          <Plus size={18} /> Add Property
        </button>
      </div>

      {/* Toolbar (Search & Filters) */}
      <div className="bg-surface border border-white/5 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search properties by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-white/10 pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-brand transition-colors placeholder:text-white/30"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-background border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand transition-colors appearance-none flex-1 md:flex-none">
            <option value="all">All Types</option>
            <option value="lands">Lands</option>
            <option value="apartments">Apartments</option>
            <option value="houses">Houses</option>
            <option value="commercial">Commercial</option>
          </select>
          <select className="bg-background border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand transition-colors appearance-none flex-1 md:flex-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50 w-24">
                Image
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50">
                Property Details
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50">
                Type
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50">
                Price
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50">
                Status
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="relative w-16 h-12 bg-background border border-white/10 overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-white text-sm mb-1">
                      {property.title}
                    </p>
                    <p className="text-xs text-white/50">{property.location}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                      {property.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-sm text-white">
                    {property.price}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleStatus(property.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-colors",
                        property.status === "active"
                          ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10",
                      )}
                    >
                      {property.status === "active" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {property.status}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-8 h-8 flex items-center justify-center bg-background border border-white/10 hover:border-brand hover:text-brand transition-colors text-white/70"
                        title="Edit Property"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteProperty(property.id)}
                        className="w-8 h-8 flex items-center justify-center bg-background border border-white/10 hover:border-red-500 hover:text-red-500 transition-colors text-white/70"
                        title="Delete Property"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center bg-background border border-white/10 hover:border-white transition-colors text-white/70">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-white/50 text-sm"
                >
                  No properties found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over Add/Edit Modal (Simulated) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-2xl bg-background border-l border-white/10 h-full flex flex-col shadow-2xl transform transition-transform duration-300">
            {/* Modal Header */}
            <div className="h-20 flex items-center justify-between px-8 border-b border-white/10 bg-surface">
              <h2 className="text-xl font-bold text-white">Add New Property</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand border-b border-white/5 pb-2">
                  Basic Info
                </h3>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                    Property Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury Beachfront Villa"
                    className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Property Type
                    </label>
                    <select className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors appearance-none">
                      <option>Lands</option>
                      <option>Apartments</option>
                      <option>Houses</option>
                      <option>Commercial</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Price
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $1,250,000"
                      className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand border-b border-white/5 pb-2">
                  Media
                </h3>
                <div className="w-full h-40 border-2 border-dashed border-white/20 bg-surface flex flex-col items-center justify-center text-white/50 hover:border-brand hover:text-brand transition-colors cursor-pointer">
                  <Plus size={32} className="mb-2" />
                  <span className="text-sm font-bold">Upload Main Image</span>
                  <span className="text-xs mt-1 opacity-70">
                    JPG, PNG up to 5MB
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand border-b border-white/5 pb-2">
                  Details
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Write a compelling overview..."
                    className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-white/10 bg-surface flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 font-bold text-sm uppercase tracking-wider text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-brand hover:bg-white text-white hover:text-navy px-8 py-3 font-bold text-sm uppercase tracking-wider transition-colors duration-300"
              >
                Save Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
