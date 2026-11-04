-- ==============================================================================
-- CLEAN / PURGE ALL DEMO DATA FROM SUPABASE
-- Run this in your Supabase SQL Editor to wipe demo products, orders, and library entitlements
-- ==============================================================================

-- 1. Remove all entitlements and order records
TRUNCATE TABLE public.entitlements CASCADE;
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.reviews CASCADE;

-- 2. Remove all products
TRUNCATE TABLE public.products CASCADE;

-- If you also want to remove categories, uncomment the line below:
-- TRUNCATE TABLE public.categories CASCADE;
