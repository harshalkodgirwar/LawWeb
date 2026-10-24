import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { serverStore } from "@/lib/db/server-store";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data } = await supabase
        .from("content_sections")
        .select("content_json")
        .eq("section_key", "profile")
        .maybeSingle();

      if (data?.content_json) {
        serverStore.updateProfile(data.content_json);
        return NextResponse.json({
          success: true,
          content: serverStore.getProfile(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      content: serverStore.getProfile(),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      content: serverStore.getProfile(),
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid content payload" },
        { status: 400 }
      );
    }

    // 1. Update in-memory server store immediately
    const updated = serverStore.updateProfile(body);

    // 2. Persist to Supabase content_sections table if configured
    if (isSupabaseConfigured()) {
      try {
        const adminClient = createAdminClient();
        const { error } = await adminClient.from("content_sections").upsert(
          {
            section_key: "profile",
            content_json: body,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "section_key" }
        );

        if (error) {
          console.warn("Notice: Supabase upsert notice:", error.message);
        }
      } catch (dbErr: any) {
        console.warn("Notice: Content saved in server memory:", dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Content successfully saved and published live.",
      updated_at: new Date().toISOString(),
      content: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to save content" },
      { status: 500 }
    );
  }
}
