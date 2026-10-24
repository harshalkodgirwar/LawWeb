"use client";

import React, { useState } from "react";
import { SEED_CATEGORIES } from "@/lib/db/seed-data";
import { Category } from "@/lib/db/types";
import { Plus, FolderTree, Edit2, Trash2, X } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: Category = {
      id: "cat-" + Date.now(),
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      display_order: categories.length + 1,
      created_at: new Date().toISOString(),
    };
    setCategories([...categories, newCat]);
    setName("");
    setSlug("");
    setDescription("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Category Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize study materials by legal branches, examination boards, and practice areas.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] text-white text-xs font-bold shadow-md transition-all border border-[#C5A059]/40"
        >
          <Plus className="w-4 h-4 text-[#E5C378]" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-stone-400 font-mono text-[10px] uppercase">
              <th className="py-3 px-4 font-semibold">Category Name</th>
              <th className="py-3 px-4 font-semibold">Slug</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold text-right">Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {categories.map((c, idx) => (
              <tr key={c.id} className="hover:bg-stone-50/70">
                <td className="py-3.5 px-4 font-bold text-stone-900">{c.name}</td>
                <td className="py-3.5 px-4 font-mono text-stone-500 text-[11px]">{c.slug}</td>
                <td className="py-3.5 px-4 text-stone-600 max-w-sm truncate">{c.description}</td>
                <td className="py-3.5 px-4 text-right font-mono font-medium">{idx + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-stone-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-base font-bold text-stone-900">Add Legal Category</h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Environmental Law"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. environmental-law"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B132B] text-white rounded-xl font-bold"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
