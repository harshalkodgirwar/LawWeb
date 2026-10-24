export type UserRole = "customer" | "admin";

export type OrderStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export type PaymentStatus = "created" | "authorized" | "captured" | "failed" | "refunded";

export interface Profile {
  id: string; // references auth.users
  full_name: string | null;
  avatar_url: string | null;
  email?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon?: string | null;
  display_order: number;
  created_at: string;
}

export interface ProductTopic {
  title: string;
  subtopics?: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  price_paise: number; // integer paise, e.g. 49900 = ₹499.00
  original_price_paise: number | null;
  category_id: string;
  category?: Category;
  cover_image_path: string;
  pdf_storage_path: string;
  preview_storage_path: string | null;
  page_count: number | null;
  file_format: string; // 'PDF'
  topics: ProductTopic[];
  target_audience: string[];
  learning_outcomes: string[];
  is_featured: boolean;
  is_published: boolean;
  sales_count: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount_paise: number;
  currency: string; // 'INR'
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title_snapshot: string;
  unit_price_paise: number;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Payment {
  id: string;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  amount_paise: number;
  currency: string;
  status: PaymentStatus;
  signature_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Entitlement {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string;
  granted_at: string;
  revoked_at: string | null;
  product?: Product;
}

export interface Refund {
  id: string;
  order_id: string;
  payment_id: string;
  razorpay_refund_id: string;
  amount_paise: number;
  reason: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContentSection {
  id: string;
  section_key: string;
  content_json: Record<string, any>;
  updated_at: string;
}

export interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  processed: boolean;
  payload: Record<string, any>;
  created_at: string;
}
