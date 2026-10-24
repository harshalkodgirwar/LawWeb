import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Internal order ID is required"),
  razorpayOrderId: z.string().min(1, "Razorpay order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay payment ID is required"),
  razorpaySignature: z.string().min(1, "Razorpay signature is required"),
});

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z.enum(["general", "study-materials", "mentorship", "speaking", "technical"]).default("general"),
});

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  short_description: z.string().min(10, "Short description must be at least 10 characters"),
  description: z.string().min(20, "Full description must be at least 20 characters"),
  price_paise: z.number().int().positive("Price must be a positive integer in paise"),
  original_price_paise: z.number().int().positive().nullable().optional(),
  category_id: z.string().min(1, "Category is required"),
  page_count: z.number().int().positive().nullable().optional(),
  file_format: z.string().default("PDF"),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
