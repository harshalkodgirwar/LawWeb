import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Product } from "@/lib/db/types";
import { serverStore } from "@/lib/db/server-store";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";

export async function GET() {
  try {
    const products = serverStore.getProducts();
    return NextResponse.json({ success: true, products });
  } catch {
    return NextResponse.json({ success: true, products: serverStore.getProducts() });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.title || !body.price_paise) {
      return NextResponse.json(
        { message: "Missing required product fields (title, price_paise)" },
        { status: 400 }
      );
    }

    const productId = body.id || "prod-" + Date.now();
    const productSlug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const productRecord: Product = {
      id: productId,
      title: body.title,
      slug: productSlug,
      short_description: body.short_description || "",
      description: body.description || "",
      price_paise: Number(body.price_paise),
      original_price_paise: body.original_price_paise ? Number(body.original_price_paise) : null,
      category_id: body.category_id || "cat-1",
      cover_image_path: body.cover_image_path || "/covers/generic-legal-cover.png",
      pdf_storage_path: body.pdf_storage_path || `materials/${productSlug}.pdf`,
      preview_storage_path: body.preview_storage_path || `previews/${productSlug}_preview.pdf`,
      page_count: body.page_count ? Number(body.page_count) : 250,
      file_format: body.file_format || "PDF",
      topics: body.topics || [{ title: "Doctrinal Analysis & Case Law" }],
      target_audience: body.target_audience || ["Judiciary Aspirants", "Law Students"],
      learning_outcomes: body.learning_outcomes || ["Doctrinal and procedural mastery"],
      is_featured: Boolean(body.is_featured),
      is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
      sales_count: body.sales_count || 0,
      rating: body.rating || 5.0,
      reviews_count: body.reviews_count || 0,
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Update in-memory server store
    const saved = serverStore.saveProduct(productRecord);

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const adminClient = createAdminClient();
        await adminClient.from("products").upsert(productRecord, { onConflict: "id" });
      } catch (err: any) {
        console.warn("Notice: Product saved in server store:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Study material "${saved.title}" successfully saved and published.`,
      product: saved,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to save product" },
      { status: 500 }
    );
  }
}
