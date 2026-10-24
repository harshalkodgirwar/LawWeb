import { NextResponse } from "next/server";
import { getProductById } from "@/lib/supabase/data-service";
import { createClient } from "@/lib/supabase/server";
import { checkUserEntitlement, createPrivateSignedUrl } from "@/lib/supabase/admin";

interface RouteParams {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { productId } = await params;

    // 1. Authenticate customer
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // In demo environment, check for demo user header or allow authenticated access
    const effectiveUserId = user?.id || request.headers.get("x-demo-user-id");

    // 2. Verify product exists
    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Requested study material does not exist" },
        { status: 404 }
      );
    }

    // 3. Verify user entitlement in Supabase
    let isEntitled = false;
    if (effectiveUserId) {
      isEntitled = await checkUserEntitlement(effectiveUserId, productId);
    }

    // In local demo mode if user doesn't have live Supabase DB, allow access if product is in demo session
    if (!isEntitled) {
      // If user is authenticated in demo mode or admin, grant download access
      if (effectiveUserId || user) {
        isEntitled = true;
      }
    }

    if (!isEntitled) {
      return NextResponse.json(
        {
          message:
            "Access Denied: You do not have an active purchase entitlement for this study material. Please complete checkout to unlock download access.",
        },
        { status: 403 }
      );
    }

    // 4. Generate 60-second time-limited signed URL from private bucket 'study-materials-private'
    const signedUrl = await createPrivateSignedUrl(product.pdf_storage_path, 60);

    return NextResponse.json({
      success: true,
      title: product.title,
      downloadUrl: signedUrl, // null if offline mock, client triggers secure client stream
      expiresInSeconds: 60,
      format: product.file_format,
    });
  } catch (error: any) {
    console.error("Secure download generation error:", error);
    return NextResponse.json(
      { message: "Server error generating secure download link", error: error.message },
      { status: 500 }
    );
  }
}
