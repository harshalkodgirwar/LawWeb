-- ==============================================================================
-- LAWYER PORTFOLIO & DIGITAL STUDY MATERIAL MARKETPLACE
-- Initial Supabase PostgreSQL Schema & RLS Policies
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('customer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('created', 'authorized', 'captured', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. USER ROLES TABLE (strictly controlled role mapping)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role user_role_type NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Helper function to check if the current user has admin role (SECURITY DEFINER to prevent recursion/tampering)
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = check_user_id AND role = 'admin'
    );
$$;

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PRODUCTS TABLE (Money represented in exact integer paise)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price_paise BIGINT NOT NULL CHECK (price_paise >= 0),
    original_price_paise BIGINT CHECK (original_price_paise >= price_paise),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    cover_image_path TEXT NOT NULL,
    pdf_storage_path TEXT NOT NULL,
    preview_storage_path TEXT,
    page_count INT,
    file_format TEXT NOT NULL DEFAULT 'PDF',
    topics JSONB DEFAULT '[]'::jsonb,
    target_audience JSONB DEFAULT '[]'::jsonb,
    learning_outcomes JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sales_count INT DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 4.90,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount_paise BIGINT NOT NULL CHECK (total_amount_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status order_status_type NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 8. ORDER ITEMS TABLE (Immutable purchase snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_title_snapshot TEXT NOT NULL,
    unit_price_paise BIGINT NOT NULL CHECK (unit_price_paise >= 0),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 9. PAYMENTS TABLE (Razorpay Transaction lifecycle)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    amount_paise BIGINT NOT NULL CHECK (amount_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status payment_status_type NOT NULL DEFAULT 'created',
    signature_verified_at TIMESTAMPTZ,
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment ON public.payments(razorpay_payment_id);

-- 10. ENTITLEMENTS TABLE (Authoritative permission for digital study material)
CREATE TABLE IF NOT EXISTS public.entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    revoked_at TIMESTAMPTZ,
    CONSTRAINT uq_user_product_entitlement UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_product ON public.entitlements(user_id, product_id);

-- 11. REFUNDS TABLE
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    razorpay_refund_id TEXT NOT NULL UNIQUE,
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'processed',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. CONTENT SECTIONS TABLE (Customizable portfolio & educator content)
CREATE TABLE IF NOT EXISTS public.content_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT NOT NULL UNIQUE,
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. WEBHOOK EVENTS TABLE (For idempotent processing of Razorpay webhooks)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Roles Policies (Users CANNOT modify or elevate their own role)
CREATE POLICY "Users can read own role" 
    ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user roles" 
    ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone" 
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" 
    ON public.categories FOR ALL USING (public.is_admin(auth.uid()));

-- Products Policies
CREATE POLICY "Published products are viewable by everyone" 
    ON public.products FOR SELECT 
    USING (is_published = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage products" 
    ON public.products FOR ALL USING (public.is_admin(auth.uid()));

-- Orders Policies
CREATE POLICY "Users can view their own orders" 
    ON public.orders FOR SELECT 
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own pending orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" 
    ON public.orders FOR UPDATE USING (public.is_admin(auth.uid()));

-- Order Items Policies
CREATE POLICY "Users can view own order items" 
    ON public.order_items FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin(auth.uid()))
        )
    );

-- Payments Policies
CREATE POLICY "Users can view own payments" 
    ON public.payments FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = payments.order_id AND (orders.user_id = auth.uid() OR public.is_admin(auth.uid()))
        )
    );

-- Entitlements Policies (Protected Digital Access)
CREATE POLICY "Users can view active entitlements" 
    ON public.entitlements FOR SELECT 
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Content Sections Policies
CREATE POLICY "Content sections are viewable by everyone" 
    ON public.content_sections FOR SELECT USING (true);

CREATE POLICY "Admins can edit content sections" 
    ON public.content_sections FOR ALL USING (public.is_admin(auth.uid()));

-- Refunds Policies
CREATE POLICY "Admins and affected users can view refunds" 
    ON public.refunds FOR SELECT 
    USING (
        public.is_admin(auth.uid()) OR EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = refunds.order_id AND orders.user_id = auth.uid()
        )
    );

-- Webhook Events Policies (Restricted strictly to Admin/Service role)
CREATE POLICY "Admins can view webhook events" 
    ON public.webhook_events FOR SELECT USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Law Student'),
        new.email,
        new.raw_user_meta_data->>'avatar_url'
    );

    -- Default role: customer
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'customer')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
-- Private bucket for paid PDFs: 'study-materials-private'
-- Public bucket for covers and preview excerpts: 'materials-public'

INSERT INTO storage.buckets (id, name, public)
VALUES ('study-materials-private', 'study-materials-private', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('materials-public', 'materials-public', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read images from materials-public
CREATE POLICY "Public Access for Materials Public Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'materials-public');

-- Only admins can upload/modify materials-public
CREATE POLICY "Admin Upload to Materials Public Bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'materials-public' AND public.is_admin(auth.uid()));

-- Private bucket policy: No public read; downloads require server signed URL or active entitlement
CREATE POLICY "Private Study Materials Download Access"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'study-materials-private' AND (
        public.is_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.entitlements e
            JOIN public.products p ON p.id = e.product_id
            WHERE e.user_id = auth.uid() 
              AND e.revoked_at IS NULL
              AND p.pdf_storage_path = storage.objects.name
        )
    )
);
