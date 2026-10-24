import { createClient } from "./server";
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_PROFILE_CONFIG } from "../db/seed-data";
import { Category, Product, Order, Entitlement } from "../db/types";
import { serverStore } from "../db/server-store";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("placeholder-project"));
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return SEED_CATEGORIES;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return SEED_CATEGORIES;
    }
    return data as Category[];
  } catch {
    return SEED_CATEGORIES;
  }
}

export async function getProducts(options?: {
  categoryId?: string;
  isFeatured?: boolean;
  search?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "popularity";
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    let results = serverStore.getProducts();

    if (options?.categoryId && options.categoryId !== "all") {
      results = results.filter((p) => p.category_id === options.categoryId);
    }

    if (options?.isFeatured) {
      results = results.filter((p) => p.is_featured);
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (options?.sortBy) {
      switch (options.sortBy) {
        case "price_asc":
          results.sort((a, b) => a.price_paise - b.price_paise);
          break;
        case "price_desc":
          results.sort((a, b) => b.price_paise - a.price_paise);
          break;
        case "popularity":
          results.sort((a, b) => b.sales_count - a.sales_count);
          break;
        case "newest":
        default:
          results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
      }
    }

    return results;
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_published", true);

    if (options?.categoryId && options.categoryId !== "all") {
      query = query.eq("category_id", options.categoryId);
    }

    if (options?.isFeatured) {
      query = query.eq("is_featured", true);
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,short_description.ilike.%${options.search}%`);
    }

    if (options?.sortBy) {
      switch (options.sortBy) {
        case "price_asc":
          query = query.order("price_paise", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price_paise", { ascending: false });
          break;
        case "popularity":
          query = query.order("sales_count", { ascending: false });
          break;
        case "newest":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return SEED_PRODUCTS;
    }

    return data as Product[];
  } catch {
    return SEED_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const found = serverStore.getProductBySlug(slug) || SEED_PRODUCTS.find((p) => p.slug === slug);
    if (!found) return null;
    const cat = SEED_CATEGORIES.find((c) => c.id === found.category_id);
    return { ...found, category: cat };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      const fallback = serverStore.getProductBySlug(slug) || SEED_PRODUCTS.find((p) => p.slug === slug);
      if (fallback) {
        const cat = SEED_CATEGORIES.find((c) => c.id === fallback.category_id);
        return { ...fallback, category: cat };
      }
      return null;
    }

    return data as Product;
  } catch {
    const fallback = serverStore.getProductBySlug(slug) || SEED_PRODUCTS.find((p) => p.slug === slug);
    return fallback || null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const found = serverStore.getProductById(id) || SEED_PRODUCTS.find((p) => p.id === id);
    if (!found) return null;
    const cat = SEED_CATEGORIES.find((c) => c.id === found.category_id);
    return { ...found, category: cat };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      const fallback = serverStore.getProductById(id) || SEED_PRODUCTS.find((p) => p.id === id);
      return fallback || null;
    }

    return data as Product;
  } catch {
    const fallback = serverStore.getProductById(id) || SEED_PRODUCTS.find((p) => p.id === id);
    return fallback || null;
  }
}

export async function getProfileContent() {
  if (!isSupabaseConfigured()) {
    return serverStore.getProfile();
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("content_sections")
      .select("*")
      .in("section_key", ["profile", "hero"]);

    if (!data || data.length === 0) return serverStore.getProfile();

    const profileData = data.find((d) => d.section_key === "profile")?.content_json;
    return {
      ...serverStore.getProfile(),
      ...profileData,
    };
  } catch {
    return serverStore.getProfile();
  }
}
