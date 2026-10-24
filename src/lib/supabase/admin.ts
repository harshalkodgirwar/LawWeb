import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase Client (Service Role).
 * CRITICAL SECURITY RULE: NEVER import or expose this on the client-side.
 * Used exclusively in Server Actions, Route Handlers, and Webhook verification.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Check if a user has admin privileges.
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  // If in demo mode with specific mock admin ID
  if (process.env.MOCK_ADMIN_USER_ID && userId === process.env.MOCK_ADMIN_USER_ID) {
    return true;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error || !data) return false;
    return data.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Check whether a user is entitled to download a specific product.
 */
export async function checkUserEntitlement(userId: string, productId: string): Promise<boolean> {
  if (!userId || !productId) return false;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("entitlements")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .is("revoked_at", null)
      .maybeSingle();

    if (error || !data) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a short-lived signed URL for a private PDF study material.
 * Valid for 60 seconds by default to prevent link sharing.
 */
export async function createPrivateSignedUrl(filePath: string, expiresInSeconds: number = 60): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from("study-materials-private")
      .createSignedUrl(filePath, expiresInSeconds);

    if (error || !data) {
      console.error("Failed to generate signed download URL:", error);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("Exception generating signed download URL:", err);
    return null;
  }
}
