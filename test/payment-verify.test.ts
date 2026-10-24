import { test, describe } from "node:test";
import assert from "node:assert";
import crypto from "crypto";
import { verifyPaymentSignature, verifyWebhookSignature } from "../src/lib/razorpay/verify";

describe("Razorpay HMAC SHA256 Security & Verification", () => {
  const mockSecret = "test_secret_key_84910284910";
  const razorpayOrderId = "order_N829104819";
  const razorpayPaymentId = "pay_P819204812";

  test("should successfully verify authentic Razorpay signature generated with secret", () => {
    // Generate valid HMAC SHA256 signature
    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const validSignature = crypto
      .createHmac("sha256", mockSecret)
      .update(payload)
      .digest("hex");

    const result = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: validSignature,
      secret: mockSecret,
    });

    assert.strictEqual(result, true, "Signature verification should pass for untampered payload");
  });

  test("should reject tampered payment ID or altered order ID", () => {
    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const validSignature = crypto
      .createHmac("sha256", mockSecret)
      .update(payload)
      .digest("hex");

    // Tampered payment ID
    const resultTamperedPayment = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId: "pay_tampered_attack_id",
      razorpaySignature: validSignature,
      secret: mockSecret,
    });

    assert.strictEqual(resultTamperedPayment, false, "Must reject tampered payment ID");

    // Tampered order ID
    const resultTamperedOrder = verifyPaymentSignature({
      razorpayOrderId: "order_different_order",
      razorpayPaymentId,
      razorpaySignature: validSignature,
      secret: mockSecret,
    });

    assert.strictEqual(resultTamperedOrder, false, "Must reject tampered order ID");
  });

  test("should reject verification when invalid secret or empty credentials provided", () => {
    const result = verifyPaymentSignature({
      razorpayOrderId: "",
      razorpayPaymentId,
      razorpaySignature: "dummy_sig",
      secret: mockSecret,
    });

    assert.strictEqual(result, false, "Must reject empty order ID");
  });

  test("should verify authentic webhook raw payload signature", () => {
    const webhookSecret = "whsec_super_secret_test_key";
    const rawBody = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_test_123", amount: 69900 } } },
    });

    const validSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const verified = verifyWebhookSignature({
      rawBody,
      signature: validSignature,
      webhookSecret,
    });

    assert.strictEqual(verified, true, "Webhook signature verification must pass for raw payload");

    // Tampered body
    const tampered = verifyWebhookSignature({
      rawBody: rawBody + " ",
      signature: validSignature,
      webhookSecret,
    });

    assert.strictEqual(tampered, false, "Must fail if raw body is altered by even one character");
  });
});
