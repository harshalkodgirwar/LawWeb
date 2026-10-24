import { NextResponse } from "next/server";
import { verifyWebhookSignature, fulfillOrderAndEntitlements } from "@/lib/razorpay/verify";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Verify Webhook Signature against raw body
    if (webhookSecret && webhookSecret !== "rzp_webhook_secret_placeholder") {
      if (!signature) {
        return NextResponse.json({ message: "Missing Razorpay signature header" }, { status: 400 });
      }

      const isValid = verifyWebhookSignature({
        rawBody,
        signature,
        webhookSecret,
      });

      if (!isValid) {
        return NextResponse.json({ message: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // 2. Idempotency Check: Avoid processing the same webhook event twice
    const supabase = createAdminClient();
    try {
      const { data: existingEvent } = await supabase
        .from("webhook_events")
        .select("id, processed")
        .eq("event_id", eventId)
        .maybeSingle();

      if (existingEvent && existingEvent.processed) {
        return NextResponse.json({ received: true, alreadyProcessed: true });
      }

      // Record event in database
      await supabase.from("webhook_events").upsert(
        {
          event_id: eventId,
          event_type: eventType,
          processed: false,
          payload,
        },
        { onConflict: "event_id" }
      );
    } catch {
      // In local dev without live database, proceed gracefully
    }

    // 3. Process Specific Events
    switch (eventType) {
      case "order.paid":
      case "payment.captured": {
        const paymentEntity = payload.payload?.payment?.entity;
        const orderEntity = payload.payload?.order?.entity;

        const razorpayPaymentId = paymentEntity?.id;
        const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
        const amountPaise = paymentEntity?.amount || orderEntity?.amount;
        const internalOrderId = orderEntity?.notes?.internal_order_id || paymentEntity?.notes?.internal_order_id;
        const userId = orderEntity?.notes?.user_id || paymentEntity?.notes?.user_id;

        if (internalOrderId && razorpayPaymentId) {
          await fulfillOrderAndEntitlements({
            orderId: internalOrderId,
            razorpayOrderId,
            razorpayPaymentId,
            amountPaise,
            userId: userId || "user",
            rawPayload: payload,
          });
        }
        break;
      }

      case "payment.failed": {
        const paymentEntity = payload.payload?.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id;
        if (razorpayOrderId) {
          try {
            await supabase
              .from("payments")
              .update({ status: "failed", updated_at: new Date().toISOString() })
              .eq("razorpay_order_id", razorpayOrderId);
          } catch {
            // ignore
          }
        }
        break;
      }

      case "refund.processed": {
        const refundEntity = payload.payload?.refund?.entity;
        const paymentId = refundEntity?.payment_id;
        const refundId = refundEntity?.id;
        const amountPaise = refundEntity?.amount;

        if (refundId && paymentId) {
          try {
            await supabase.from("refunds").insert({
              razorpay_refund_id: refundId,
              amount_paise: amountPaise,
              status: "processed",
            });
          } catch {
            // ignore
          }
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    // Mark event as processed
    try {
      await supabase
        .from("webhook_events")
        .update({ processed: true })
        .eq("event_id", eventId);
    } catch {
      // ignore
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { message: "Webhook handler failed", error: err.message },
      { status: 500 }
    );
  }
}
