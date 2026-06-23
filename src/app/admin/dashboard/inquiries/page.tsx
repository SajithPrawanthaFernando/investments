"use client";

import { useState } from "react";
import {
  Search,
  Trash2,
  X,
  Mail,
  MailOpen,
  Phone,
  CheckCircle,
  Building,
  Home,
  MessageSquare,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simulated inquiry data
const initialInquiries = [
  {
    id: "INQ-001",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+65 9123 4567",
    type: "invest",
    category: "Luxury Apartments",
    message:
      "I am looking for a 3-bedroom luxury apartment in Colombo 01. Budget is around $500k. Looking to finalize within the next 2 months.",
    status: "unread",
    date: "Jun 22, 2026",
  },
  {
    id: "INQ-002",
    name: "Sarah Wijeratne",
    email: "sarah.w@example.lk",
    phone: "+94 77 123 4567",
    type: "list",
    category: "Exclusive Lands",
    message:
      "I have a 40-perch beachfront land in Unawatuna that I would like to list with your agency. Please call me to discuss terms.",
    status: "read",
    date: "Jun 21, 2026",
  },
  {
    id: "INQ-003",
    name: "David Sterling",
    email: "david@sterlingholdings.com",
    phone: "+44 7700 900077",
    type: "invest",
    category: "Commercial Buildings",
    message:
      "Our firm is exploring commercial real estate opportunities in Kandy. We need a property with at least 10,000 sqft of office space for a new regional hub.",
    status: "contacted",
    date: "Jun 19, 2026",
  },
];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<
    (typeof initialInquiries)[0] | null
  >(null);

  // Filter logic
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || inq.type === filterType;
    return matchesSearch && matchesType;
  });

  // Action Handlers
  const deleteInquiry = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("Are you sure you want to delete this inquiry?")) {
      setInquiries(inquiries.filter((i) => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const updateStatus = (id: string, newStatus: string) => {
    setInquiries(
      inquiries.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  const handleRowClick = (inquiry: (typeof initialInquiries)[0]) => {
    setSelectedInquiry(inquiry);
    // Auto-mark as read if it was unread
    if (inquiry.status === "unread") {
      updateStatus(inquiry.id, "read");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col justify-between items-start gap-2">
        <h1 className="text-3xl font-bold text-white mb-1">Inquiries</h1>
        <p className="text-white/50 text-sm">
          Manage incoming leads from investors and property owners.
        </p>
      </div>

      {/* Toolbar (Search & Filters) */}
      <div className="bg-surface border border-white/5 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-white/10 pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-brand transition-colors placeholder:text-white/30"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-background border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-brand transition-colors appearance-none flex-1 md:flex-none"
          >
            <option value="all">All Inquiries</option>
            <option value="invest">Investors</option>
            <option value="list">Property Listers</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50 w-16">
                Status
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50">
                Contact Info
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50">
                Intent
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50">
                Date
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  onClick={() => handleRowClick(inquiry)}
                  className={cn(
                    "group cursor-pointer transition-colors",
                    inquiry.status === "unread"
                      ? "bg-white/[0.04] hover:bg-white/[0.06]"
                      : "hover:bg-white/[0.02]",
                  )}
                >
                  <td className="py-4 px-6">
                    {inquiry.status === "unread" && (
                      <Mail size={18} className="text-brand" />
                    )}
                    {inquiry.status === "read" && (
                      <MailOpen size={18} className="text-white/40" />
                    )}
                    {inquiry.status === "contacted" && (
                      <CheckCircle size={18} className="text-green-500" />
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <p
                      className={cn(
                        "text-sm mb-1",
                        inquiry.status === "unread"
                          ? "font-bold text-white"
                          : "font-medium text-white/80",
                      )}
                    >
                      {inquiry.name}
                    </p>
                    <p className="text-xs text-white/50">{inquiry.email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-2 text-xs font-medium text-white/70">
                      {inquiry.type === "invest" ? (
                        <Building size={14} className="text-brand" />
                      ) : (
                        <Home size={14} className="text-purple-400" />
                      )}
                      <span className="uppercase tracking-wider">
                        {inquiry.type === "invest" ? "Invest" : "List"}
                      </span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-white/60">
                    {inquiry.date}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => deleteInquiry(inquiry.id, e)}
                        className="w-8 h-8 flex items-center justify-center bg-background border border-white/10 hover:border-red-500 hover:text-red-500 transition-colors text-white/70"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-white/50 text-sm"
                >
                  No inquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over View Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedInquiry(null)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-xl bg-background border-l border-white/10 h-full flex flex-col shadow-2xl transform transition-transform duration-300">
            {/* Modal Header */}
            <div className="h-20 flex items-center justify-between px-8 border-b border-white/10 bg-surface shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <MessageSquare size={20} className="text-brand" />
                Inquiry Details
              </h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Intent Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 text-sm font-bold uppercase tracking-wider text-white">
                {selectedInquiry.type === "invest" ? (
                  <Building size={16} className="text-brand" />
                ) : (
                  <Home size={16} className="text-purple-400" />
                )}
                {selectedInquiry.type === "invest"
                  ? "Wants to Invest"
                  : "Wants to List Property"}
              </div>

              {/* Contact Info */}
              <div className="bg-surface border border-white/5 p-6 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">
                    Full Name
                  </p>
                  <p className="text-lg font-medium text-white">
                    {selectedInquiry.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-sm text-brand hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="text-sm text-brand hover:underline"
                    >
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">
                    Target Category
                  </p>
                  <p className="text-sm font-medium text-white/80">
                    {selectedInquiry.category}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand border-b border-white/5 pb-2">
                  Message
                </h3>
                <div className="bg-surface border border-white/5 p-6">
                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="p-8 border-t border-white/10 bg-surface flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <button
                onClick={() => deleteInquiry(selectedInquiry.id)}
                className="text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete
              </button>

              <div className="flex gap-4 w-full sm:w-auto">
                {selectedInquiry.status !== "contacted" && (
                  <button
                    onClick={() =>
                      updateStatus(selectedInquiry.id, "contacted")
                    }
                    className="w-full sm:w-auto px-6 py-3 border border-brand text-brand hover:bg-brand hover:text-white font-bold text-sm uppercase tracking-wider transition-colors"
                  >
                    Mark as Contacted
                  </button>
                )}
                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-3 font-bold text-sm uppercase tracking-wider transition-colors duration-300 text-center flex items-center justify-center gap-2"
                >
                  <Phone size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
