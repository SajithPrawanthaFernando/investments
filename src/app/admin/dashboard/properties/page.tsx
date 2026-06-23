"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/utils/client";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminProperties() {
  const supabase = createClient();
  const [properties, setProperties] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    title: "",
    type: "Lands",
    price: "",
    location: "",
    locationUrl: "", // <-- Added the new location URL field
    description: "",
    status: "active",
  });

  // Image Management States
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDeleteFromStorage, setImagesToDeleteFromStorage] = useState<
    string[]
  >([]);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProperties(data);
    }
    setIsLoading(false);
  };

  // --- MODAL HANDLERS ---
  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setFormData({
      title: "",
      type: "Lands",
      price: "",
      location: "",
      locationUrl: "",
      description: "",
      status: "active",
    });
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setExistingImages([]);
    setImagesToDeleteFromStorage([]);
    setIsModalOpen(true);
  };

  const openEditModal = (property: any, mode: "edit" | "view") => {
    setModalMode(mode);
    setEditingId(property.id);
    setFormData({
      title: property.title,
      type: property.type,
      price: property.price,
      location: property.location,
      locationUrl: property.locationUrl || "", // Parse from DB if it exists
      description: property.description || "",
      status: property.status || "active",
    });
    setExistingImages(property.images || []);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setImagesToDeleteFromStorage([]);
    setIsModalOpen(true);
  };

  // --- IMAGE SELECTION HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImageFiles((prev) => [...prev, ...filesArray]);

      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...previewsArray]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (urlToRemove: string) => {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
    setImagesToDeleteFromStorage((prev) => [...prev, urlToRemove]);
  };

  // --- SUBMIT HANDLER (ADD & EDIT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingImages.length === 0 && newImageFiles.length === 0) {
      alert("Please ensure the property has at least one image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Delete removed images from storage (if Editing)
      if (imagesToDeleteFromStorage.length > 0) {
        const pathsToDelete = imagesToDeleteFromStorage.map(
          (url) => url.split("/").pop() as string,
        );
        await supabase.storage.from("property-images").remove(pathsToDelete);
      }

      // 2. Upload new images to Storage
      const uploadedUrls: string[] = [];
      for (const file of newImageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      // Combine remaining existing images with newly uploaded ones
      const finalImagesArray = [...existingImages, ...uploadedUrls];

      // 3. Insert or Update Database
      if (modalMode === "add") {
        const { error: insertError } = await supabase
          .from("properties")
          .insert([
            {
              ...formData,
              images: finalImagesArray,
            },
          ]);
        if (insertError) throw insertError;
      } else if (modalMode === "edit" && editingId) {
        const { error: updateError } = await supabase
          .from("properties")
          .update({
            ...formData,
            images: finalImagesArray,
          })
          .eq("id", editingId);
        if (updateError) throw updateError;
      }

      setIsModalOpen(false);
      fetchProperties();
    } catch (error: any) {
      alert(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE PROPERTY HANDLER ---
  const deleteProperty = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this property AND all its images?",
      )
    ) {
      const propertyToDelete = properties.find((p) => p.id === id);

      // Optimistic UI update
      setProperties(properties.filter((p) => p.id !== id));

      try {
        if (
          propertyToDelete &&
          propertyToDelete.images &&
          propertyToDelete.images.length > 0
        ) {
          const pathsToDelete = propertyToDelete.images.map(
            (url: string) => url.split("/").pop() as string,
          );
          await supabase.storage.from("property-images").remove(pathsToDelete);
        }

        const { error } = await supabase
          .from("properties")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (error) {
        alert("Failed to fully delete property.");
        fetchProperties();
      }
    }
  };

  // --- DIRECT STATUS UPDATE FROM TABLE ---
  const updateStatus = async (id: string, newStatus: string) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
    );
    await supabase
      .from("properties")
      .update({ status: newStatus })
      .eq("id", id);
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          onClick={openAddModal}
          className="bg-brand hover:bg-white text-white hover:text-navy px-6 py-3 font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-colors duration-300"
        >
          <Plus size={18} /> Add Property
        </button>
      </div>

      {/* Toolbar */}
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
      </div>

      {/* Data Table */}
      <div className="bg-surface border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50 w-24">
                Main Image
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-white/50">
                Details
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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-white/50">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />{" "}
                  Loading...
                </td>
              </tr>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="relative w-16 h-12 bg-background border border-white/10 overflow-hidden">
                      {property.images && property.images.length > 0 && (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      )}
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

                  {/* INSTANT INLINE STATUS DROPDOWN */}
                  <td className="py-4 px-6">
                    <select
                      value={property.status || "active"}
                      onChange={(e) =>
                        updateStatus(property.id, e.target.value)
                      }
                      className={cn(
                        "pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-wider border outline-none appearance-none cursor-pointer transition-colors",
                        property.status === "active"
                          ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                          : property.status === "sold"
                            ? "bg-brand/10 border-brand/20 text-brand hover:bg-brand/20"
                            : property.status === "rented"
                              ? "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                              : property.status === "under_offer"
                                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                                : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10",
                      )}
                      style={{
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 8px center",
                      }}
                    >
                      <option value="active" className="bg-navy text-white">
                        Active
                      </option>
                      <option
                        value="under_offer"
                        className="bg-navy text-white"
                      >
                        Under Offer
                      </option>
                      <option value="sold" className="bg-navy text-white">
                        Sold
                      </option>
                      <option value="rented" className="bg-navy text-white">
                        Rented
                      </option>
                      <option value="inactive" className="bg-navy text-white">
                        Inactive
                      </option>
                    </select>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(property, "view")}
                        className="w-8 h-8 flex items-center justify-center bg-background border border-white/10 hover:border-brand hover:text-brand transition-colors text-white/70"
                        title="View Property"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => openEditModal(property, "edit")}
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
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over Add/Edit/View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-3xl bg-background border-l border-white/10 h-full flex flex-col shadow-2xl">
            <div className="h-20 flex items-center justify-between px-8 border-b border-white/10 bg-surface">
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                {modalMode === "add"
                  ? "Add New Property"
                  : modalMode === "edit"
                    ? "Edit Property"
                    : "View Property"}
              </h2>
              <button
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto flex flex-col"
            >
              <div className="flex-1 p-8 space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand border-b border-white/5 pb-2">
                    Basic Info
                  </h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Property Title
                    </label>
                    <input
                      disabled={modalMode === "view"}
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand disabled:opacity-50"
                    />
                  </div>

                  {/* Location Grid (Name + URL) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                        Location Name
                      </label>
                      <input
                        disabled={modalMode === "view"}
                        required
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g. Galle, Sri Lanka"
                        className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand disabled:opacity-50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                        Google Maps URL{" "}
                        <span className="opacity-50">(Optional)</span>
                      </label>
                      <input
                        disabled={modalMode === "view"}
                        type="url"
                        value={formData.locationUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationUrl: e.target.value,
                          })
                        }
                        placeholder="e.g. https://goo.gl/maps/..."
                        className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Status, Type, Price Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                        Type
                      </label>
                      <select
                        disabled={modalMode === "view"}
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand appearance-none disabled:opacity-50"
                      >
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
                        disabled={modalMode === "view"}
                        required
                        type="text"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand disabled:opacity-50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                        Status
                      </label>
                      <select
                        disabled={modalMode === "view"}
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand appearance-none disabled:opacity-50"
                      >
                        <option value="active">Active (Visible)</option>
                        <option value="under_offer">Under Offer</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Media Upload */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand border-b border-white/5 pb-2">
                    Media
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Existing Images */}
                    {existingImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative h-28 border border-white/10 bg-surface group"
                      >
                        <Image
                          src={url}
                          alt={`Existing ${idx}`}
                          fill
                          className="object-cover"
                        />
                        {modalMode !== "view" && (
                          <button
                            type="button"
                            onClick={() => removeExistingImage(url)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* New Upload Previews */}
                    {newImagePreviews.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative h-28 border border-brand bg-brand/10 group"
                      >
                        <Image
                          src={url}
                          alt={`New ${idx}`}
                          fill
                          className="object-cover opacity-80"
                        />
                        <span className="absolute bottom-1 left-1 bg-brand text-white text-[10px] px-1 font-bold uppercase">
                          New
                        </span>
                        {modalMode !== "view" && (
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add New Image Button */}
                    {modalMode !== "view" && (
                      <label className="h-28 border-2 border-dashed border-white/20 bg-surface flex flex-col items-center justify-center text-white/50 hover:border-brand hover:text-brand transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <UploadCloud size={24} className="mb-1" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Add Images
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand border-b border-white/5 pb-2">
                    Details
                  </h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Description
                    </label>
                    <textarea
                      disabled={modalMode === "view"}
                      required
                      rows={6}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-surface border border-white/10 px-4 py-3 text-white outline-none focus:border-brand resize-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Footer */}
              <div className="p-8 border-t border-white/10 bg-surface flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-6 py-3 font-bold text-sm uppercase tracking-wider text-white/70 hover:text-white transition-colors disabled:opacity-50"
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand hover:bg-white text-white hover:text-navy px-8 py-3 font-bold text-sm uppercase tracking-wider transition-colors duration-300 flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Property"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
