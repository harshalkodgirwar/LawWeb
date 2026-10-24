import crypto from "crypto";
import { createAdminClient } from "../supabase/admin";

interface PaymentVerificationParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  secret: string;
}

/**
 * Authoritative Server-Side HMAC SHA256 Signature Verification.
 * As documented in Razorpay Docs:
 * Expected Signature = HMAC_SHA256(order_id + "|" + payment_id, secret)
 */
export function verifyPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  secret,
}: PaymentVerificationParams): boolean {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !secret) {
    return false;
  }

  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Constant-time buffer comparison to prevent timing attacks
  try {
    const a = Buffer.from(generatedSignature, "utf8");
    const b = Buffer.from(razorpaySignature, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Verify Razorpay Webhook Signature against the raw request body.
 * Header: X-Razorpay-Signature
 */
export function verifyWebhookSignature({
  rawBody,
  signature,
  webhookSecret,
}: {
  rawBody: string;
  signature: string;
  webhookSecret: string;
}): boolean {
  if (!rawBody || !signature || !webhookSecret) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  try {
    const a = Buffer.from(generatedSignature, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Idempotently fulfill an order upon verified payment.
 * 1. Checks if payment has already been recorded
 * 2. Updates orders table to 'completed'
 * 3. Records payment details in payments table
 * 4. Grants product entitlements to user
 */
export async function fulfillOrderAndEntitlements({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  amountPaise,
  userId,
  rawPayload,
}: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  amountPaise: number;
  userId: string;
  rawPayload?: any;
}) {
  const supabase = createAdminClient();

  // 1. Check idempotency: Has this payment ID or order already been finalized?
  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id, status")
    .eq("razorpay_payment_id", razorpayPaymentId)
    .maybeSingle();

  if (existingPayment && existingPayment.status === "captured") {
    return { success: true, alreadyProcessed: true };
  }

  // 2. Fetch the order and items
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Order ${orderId} not found`);
  }

  // 3. Record or update payment record
  const { error: paymentError } = await supabase.from("payments").upsert(
    {
      order_id: orderId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature || null,
      amount_paise: amountPaise,
      currency: "INR",
      status: "captured",
      signature_verified_at: new Date().toISOString(),
      raw_payload: rawPayload || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "razorpay_order_id" }
  );

  if (paymentError) {
    console.error("Failed to insert/update payment:", paymentError);
  }

  // 4. Update order status
  await supabase
    .from("orders")
    .update({
      status: "completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  // 5. Grant digital entitlements for each item in the order
  if (order.items && order.items.length > 0) {
    for (const item of order.items) {
      const { error: entError } = await supabase.from("entitlements").upsert(
        {
          user_id: userId,
          product_id: item.product_id,
          order_id: orderId,
          granted_at: new Date().toISOString(),
          revoked_at: null,
        },
        { onConflict: "user_id,product_id" }
      );

      if (entError) {
        console.error(`Failed to grant entitlement for product ${item.product_id}:`, entError);
      }

      // Increment sales count on product
      try {
        await supabase.rpc("increment_product_sales", {
          prod_id: item.product_id,
        });
      } catch {
        // Fallback if RPC is not present
      }
    }
  }

  return { success: true, alreadyProcessed: false };
}
