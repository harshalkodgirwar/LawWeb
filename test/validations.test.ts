import { test, describe } from "node:test";
import assert from "node:assert";
import { createOrderSchema, verifyPaymentSchema, productSchema } from "../src/lib/validations";

describe("Input Validation & Authorization Schemas", () => {
  test("createOrderSchema should require valid product ID", () => {
    const valid = createOrderSchema.safeParse({ productId: "prod-const-law-master" });
    assert.strictEqual(valid.success, true);

    const invalid = createOrderSchema.safeParse({ productId: "" });
    assert.strictEqual(invalid.success, false);
  });

  test("verifyPaymentSchema should enforce all 4 required payment fields", () => {
    const valid = verifyPaymentSchema.safeParse({
      orderId: "ord-12345",
      razorpayOrderId: "order_xyz123",
      razorpayPaymentId: "pay_abc789",
      razorpaySignature: "sig_mock_signature_hash",
    });
    assert.strictEqual(valid.success, true);

    const missingSig = verifyPaymentSchema.safeParse({
      orderId: "ord-12345",
      razorpayOrderId: "order_xyz123",
      razorpayPaymentId: "pay_abc789",
    });
    assert.strictEqual(missingSig.success, false);
  });

  test("productSchema should enforce integer paise pricing and valid slug", () => {
    const valid = productSchema.safeParse({
      title: "Constitutional Law Master Compendium",
      slug: "constitutional-law-master-compendium",
      short_description: "Exhaustive legal study notes covering Articles 1-395.",
      description: "Full chapter by chapter guide with solved past papers and landmark precedents.",
      price_paise: 69900,
      original_price_paise: 129900,
      category_id: "cat-1",
      page_count: 384,
      file_format: "PDF",
      is_featured: true,
      is_published: true,
    });
    assert.strictEqual(valid.success, true);

    // Negative price in paise should fail
    const invalidPrice = productSchema.safeParse({
      title: "Invalid Price Product",
      slug: "invalid-price",
      short_description: "Short description text here.",
      description: "Full description text here for the product.",
      price_paise: -500,
      category_id: "cat-1",
    });
    assert.strictEqual(invalidPrice.success, false);

    // Uppercase in slug should fail
    const invalidSlug = productSchema.safeParse({
      title: "Invalid Slug",
      slug: "Invalid Slug With Spaces",
      short_description: "Short description text here.",
      description: "Full description text here for the product.",
      price_paise: 50000,
      category_id: "cat-1",
    });
    assert.strictEqual(invalidSlug.success, false);
  });
});
