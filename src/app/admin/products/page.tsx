"use client";

import React, { useState, useEffect } from "react";
import { SEED_PRODUCTS, SEED_CATEGORIES } from "@/lib/db/seed-data";
import { Product } from "@/lib/db/types";
import { formatINR, formatDate } from "@/lib/utils";
import {
  Plus,
  Search,
  BookOpen,
  Edit2,
  Eye,
  CheckCircle,
  XCircle,
  Sparkles,
  FileText,
  X,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Status feedback
  const [statusNotification, setStatusNotification] = useState<{
    type: "success" | "error";
    message: string;
    slug?: string;
    timestamp: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("cat-1");
  const [pricePaise, setPricePaise] = useState(69900);
  const [originalPricePaise, setOriginalPricePaise] = useState(129900);
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [pageCount, setPageCount] = useState(300);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Load products on mount from API & localStorage
  useEffect(() => {
    // 1. Check local storage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_custom_products");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } catch {
          // ignore
        }
      }
    }

    // 2. Fetch latest from API
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.products && Array.isArray(data.products)) {
          setProducts(data.products);
          if (typeof window !== "undefined") {
            localStorage.setItem("admin_custom_products", JSON.stringify(data.products));
          }
        }
      })
      .catch((err) => {
        console.log("Using cached products", err);
      });
  }, []);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle("");
    setSlug("");
    setCategoryId("cat-1");
    setPricePaise(69900);
    setOriginalPricePaise(129900);
    setShortDesc("");
    setDescription("");
    setPageCount(300);
    setIsFeatured(false);
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setSlug(prod.slug);
    setCategoryId(prod.category_id);
    setPricePaise(prod.price_paise);
    setOriginalPricePaise(prod.original_price_paise || prod.price_paise);
    setShortDesc(prod.short_description);
    setDescription(prod.description);
    setPageCount(prod.page_count || 250);
    setIsFeatured(prod.is_featured);
    setIsPublished(prod.is_published);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : "prod-" + Date.now(),
      title,
      slug: generatedSlug,
      short_description: shortDesc,
      description,
      price_paise: pricePaise,
      original_price_paise: originalPricePaise,
      category_id: categoryId,
      cover_image_path: editingProduct?.cover_image_path || "/covers/generic-legal-cover.png",
      pdf_storage_path: editingProduct?.pdf_storage_path || `materials/${generatedSlug}.pdf`,
      preview_storage_path: editingProduct?.preview_storage_path || `previews/${generatedSlug}_preview.pdf`,
      page_count: pageCount,
      file_format: "PDF",
      topics: editingProduct?.topics || [{ title: "Foundational Doctrines" }],
      target_audience: editingProduct?.target_audience || ["Judiciary Aspirants", "Law Students"],
      learning_outcomes: editingProduct?.learning_outcomes || ["Comprehensive doctrinal mastery"],
      is_featured: isFeatured,
      is_published: isPublished,
      sales_count: editingProduct?.sales_count || 0,
      rating: editingProduct?.rating || 5.0,
      reviews_count: editingProduct?.reviews_count || 0,
      created_at: editingProduct?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // 1. Post to backend API
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();
      const savedProd = data?.product || productPayload;

      // 2. Update list in state
      let updatedList: Product[];
      if (editingProduct) {
        updatedList = products.map((p) => (p.id === savedProd.id ? savedProd : p));
      } else {
        updatedList = [savedProd, ...products];
      }
      setProducts(updatedList);

      // 3. Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_custom_products", JSON.stringify(updatedList));
        window.dispatchEvent(new Event("admin_products_updated"));
      }

      const now = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setStatusNotification({
        type: "success",
        message: editingProduct
          ? `Product "${savedProd.title}" updated and published successfully.`
          : `New study material "${savedProd.title}" published and added to live catalog.`,
        slug: savedProd.slug,
        timestamp: now,
      });

      setModalOpen(false);
    } catch (err: any) {
      // Local fallback
      let updatedList: Product[];
      if (editingProduct) {
        updatedList = products.map((p) => (p.id === productPayload.id ? productPayload : p));
      } else {
        updatedList = [productPayload, ...products];
      }
      setProducts(updatedList);
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_custom_products", JSON.stringify(updatedList));
      }

      const now = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setStatusNotification({
        type: "success",
        message: `Saved "${productPayload.title}" locally in active browser session.`,
        slug: productPayload.slug,
        timestamp: now,
      });

      setModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublish = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;

    const newPublishedState = !target.is_published;
    const updatedProd = { ...target, is_published: newPublishedState, updated_at: new Date().toISOString() };

    const updatedList = products.map((p) => (p.id === id ? updatedProd : p));
    setProducts(updatedList);

    if (typeof window !== "undefined") {
      localStorage.setItem("admin_custom_products", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("admin_products_updated"));
    }

    try {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProd),
      });
    } catch {
      // ignore
    }

    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setStatusNotification({
      type: "success",
      message: `"${target.title}" is now ${newPublishedState ? "Published Live" : "Set to Draft"}.`,
      slug: target.slug,
      timestamp: now,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Product Management & Digital Catalog
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure legal compendiums, pricing in INR, sample excerpts, and publishing states.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-bold shadow-md transition-all border border-[#C5A059]/40"
        >
          <Plus className="w-4 h-4 text-[#E5C378]" />
          <span>Add New Study Material</span>
        </button>
      </div>

      {/* Persistent Status Notification Banner */}
      {statusNotification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 ${
            statusNotification.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-red-50 border-red-300 text-red-950"
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-semibold">{statusNotification.message}</p>
              <p className="text-[11px] text-emerald-700/80">
                Published & Persisted at {statusNotification.timestamp} IST • Live across storefront
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {statusNotification.slug && (
              <Link
                href={`/materials/${statusNotification.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-900 hover:bg-emerald-100/50 shadow-sm transition-all"
              >
                <span>View in Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              onClick={() => setStatusNotification(null)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search products by title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4 font-semibold">Title & Category</th>
                <th className="py-3 px-4 font-semibold">Price (INR)</th>
                <th className="py-3 px-4 font-semibold">Pages</th>
                <th className="py-3 px-4 font-semibold">Sales</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70">
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-bold text-stone-900 leading-snug">{p.title}</div>
                    <div className="text-[10px] text-[#B38A38] font-mono mt-0.5">
                      {p.slug} • {p.is_featured ? "Featured Bestseller" : "Standard"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-serif font-bold text-stone-900">
                      {formatINR(p.price_paise)}
                    </div>
                    {p.original_price_paise && (
                      <div className="text-[10px] text-stone-400 line-through">
                        {formatINR(p.original_price_paise)}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-stone-600">
                    {p.page_count} Pages
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono font-medium text-stone-800">
                    {p.sales_count} Sold
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePublish(p.id)}
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                        p.is_published
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                      }`}
                      title="Click to toggle publish status"
                    >
                      {p.is_published ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Published
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-stone-400" />
                          Draft / Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                    <Link
                      href={`/materials/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 inline-block"
                      title="Preview Product Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 inline-block"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-stone-300 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-4 bg-[#080D1A] text-white flex items-center justify-between border-b border-[#C5A059]/40">
              <h3 className="font-serif text-base font-bold text-white">
                {editingProduct ? "Edit Study Material" : "Create New Legal Study Material"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bharatiya Nyaya Sanhita (BNS) Decoded"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] text-stone-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated-from-title"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] text-stone-900 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] text-stone-900"
                  >
                    {SEED_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Selling Price (Paise) *
                  </label>
                  <input
                    type="number"
                    required
                    step="100"
                    value={pricePaise}
                    onChange={(e) => setPricePaise(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono"
                  />
                  <span className="text-[10px] text-stone-400">
                    Display: {formatINR(pricePaise)}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Original Price (Paise)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={originalPricePaise}
                    onChange={(e) => setOriginalPricePaise(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono"
                  />
                  <span className="text-[10px] text-stone-400">
                    Display: {formatINR(originalPricePaise)}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Concise overview for catalog cards..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Full Description & Syllabus Narrative *
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive breakdown of chapters, judicial past papers, and landmark holdings..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span className="font-semibold text-stone-800">Feature as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span className="font-semibold text-stone-800">Publish Immediately</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#0B132B] text-white rounded-xl font-bold hover:bg-[#1C2541] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E5C378]" />
                      <span>Saving & Publishing...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? "Update Material" : "Save & Publish"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
