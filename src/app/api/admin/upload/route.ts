import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/data-service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = (formData.get("type") as string) || "material"; // "material" | "preview"
    const productSlug = (formData.get("slug") as string) || "product";

    if (!file) {
      return NextResponse.json(
        { message: "No file provided for upload" },
        { status: 400 }
      );
    }

    // Verify PDF extension
    const originalName = file.name;
    const isPdf =
      file.type === "application/pdf" ||
      originalName.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { message: "Only PDF documents (.pdf) are supported for study materials." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const cleanBaseName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const timestamp = Date.now();
    const safeFileName = `${cleanBaseName}_${timestamp}.pdf`;

    const subfolder = uploadType === "preview" ? "previews" : "materials";
    const localDir = path.join(process.cwd(), "public", "uploads", subfolder);

    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    const localFilePath = path.join(localDir, safeFileName);
    await fs.promises.writeFile(localFilePath, buffer);

    const relativePublicPath = `/uploads/${subfolder}/${safeFileName}`;
    let storagePath = relativePublicPath;

    // Optional Supabase Storage upload if live project configured
    if (isSupabaseConfigured()) {
      try {
        const adminClient = createAdminClient();
        const bucketName = uploadType === "preview" ? "materials-preview" : "study-materials-private";
        const cloudPath = `${subfolder}/${safeFileName}`;

        const { error: uploadError } = await adminClient.storage
          .from(bucketName)
          .upload(cloudPath, buffer, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (!uploadError) {
          storagePath = cloudPath;
        } else {
          console.warn("Supabase Storage Notice (using local file fallback):", uploadError.message);
        }
      } catch (sbErr: any) {
        console.warn("Supabase upload exception:", sbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `PDF "${originalName}" successfully attached.`,
      fileName: originalName,
      fileSizeBytes: file.size,
      storagePath,
      localUrl: relativePublicPath,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("PDF upload error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process PDF attachment" },
      { status: 500 }
    );
  }
}
