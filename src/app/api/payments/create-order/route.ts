import { NextResponse } from "next/server";
import { getProductById } from "@/lib/supabase/data-service";
import { getRazorpayClient, getPublicRazorpayKey } from "@/lib/razorpay/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createOrderSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const { productId } = parsed.data;

    // 1. Authoritative product and price check on the server (NEVER TRUST CLIENT)
    const product = await getProductById(productId);
    if (!product || !product.is_published) {
      return NextResponse.json(
        { message: "Product not found or currently unavailable" },
        { status: 404 }
      );
    }

    // 2. Identify authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // In local demo mode if user is passed via body/headers or mock session
    const effectiveUserId = user?.id || (request.headers.get("x-demo-user-id") || "demo-user-" + Date.now());

    // 3. Create a pending internal order in Supabase
    const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const orderAmountPaise = product.price_paise;

    let internalOrderId = "ord-" + Date.now();
    try {
      const adminClient = createAdminClient();
      const { data: orderData } = await adminClient
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: effectiveUserId,
          total_amount_paise: orderAmountPaise,
          currency: "INR",
          status: "pending",
        })
        .select("id")
        .single();

      if (orderData?.id) {
        internalOrderId = orderData.id;

        // Insert order items
        await adminClient.from("order_items").insert({
          order_id: internalOrderId,
          product_id: product.id,
          product_title_snapshot: product.title,
          unit_price_paise: product.price_paise,
          quantity: 1,
        });
      }
    } catch (err) {
      // In local dev without live database, use simulated internalOrderId
      console.log("Using simulated order ID for local session");
    }

    // 4. Create Razorpay order with secret credentials
    const razorpay = getRazorpayClient();
    let razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    if (razorpay) {
      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: orderAmountPaise,
          currency: "INR",
          receipt: orderNumber,
          notes: {
            internal_order_id: internalOrderId,
            product_id: product.id,
            user_id: effectiveUserId,
          },
        });
        razorpayOrderId = razorpayOrder.id;
      } catch (err: any) {
        console.error("Razorpay order creation error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: internalOrderId,
      orderNumber,
      razorpayOrderId,
      amountPaise: orderAmountPaise,
      currency: "INR",
      keyId: getPublicRazorpayKey(),
      product: {
        id: product.id,
        title: product.title,
        pricePaise: product.price_paise,
      },
    });
  } catch (error: any) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { message: error.message || "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
