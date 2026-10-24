# Lawyer Portfolio & Digital Legal Study Material Marketplace

A complete, production-ready Next.js web application engineered for an elite High Court & Supreme Court Advocate who is also a premier legal educator and content creator. The platform functions as both a prestigious legal portfolio and a digital commerce store where law students, judicial aspirants, and advocates purchase searchable PDF compendiums, procedural flowcharts, and judgment writing frameworks.

---

## Architecture & Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS 4 with custom legal design system (Deep Navy, Warm Ivory, Antique Gold, Charcoal)
- **Typography**: Playfair Display (Serif) & Plus Jakarta Sans
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth
- **File Storage**: Supabase Storage (`study-materials-private` private bucket with short-lived signed URLs, `materials-public` for covers)
- **Payment Processing**: Razorpay Checkout with server-authoritative HMAC SHA256 signature verification & idempotent webhooks
- **Validation**: Zod
- **Automated Tests**: Node native test runner via `tsx`

---

## Key Features

### 1. Public Website & Portfolio
- **Home Page**: Hero section with credentials, trust metrics, featured study compendiums, legal branches, educator's journey, free resources, verified testimonials, and interactive FAQs.
- **About Page**: Professional litigation background, educational qualifications, bar council enrollment credentials, and academic content creation journey.
- **Study Materials Marketplace (`/materials`)**: Searchable and filterable by subject (Constitutional Law, Criminal Law/BNS, Civil Law/CPC, Judiciary Preparation, Landmark Cases), price filter, and sorting.
- **Dynamic Product Detail Page (`/materials/[slug]`)**: Realistic hardcover book presentation, syllabus breakdown, target audience badges, verified student reviews, and an interactive **Sample PDF Excerpt Modal** with academic watermark.
- **Free Resources (`/resources`)**: Free downloadable concordance tables (IPC to BNS 2023), Article 21 flowchart, and civil suit judgment writing blueprints.
- **Legal Compliance Suite**: Privacy Policy, Terms & Conditions, Refund & Cancellation Policy, Digital Product License, and Bar Council of India regulatory disclaimer.

### 2. Customer Portal & Digital Downloads
- **Authentication**: Registration, Login, Forgot Password, and session callbacks.
- **My Study Library (`/account/library`)**: Displays purchased materials with secure, time-limited signed URL generation (60-second expiry) or encrypted streaming.
- **My Orders (`/account/orders`)**: Transaction references, Razorpay payment IDs, and printable tax invoices.
- **Profile Management (`/account/profile`)**: Manage personal details and contact preferences.

### 3. Razorpay Payment Lifecycle
- Server-authoritative order creation (`/api/payments/create-order`) — prices are strictly fetched from database records.
- Official Razorpay modal checkout in Indian Rupees (INR).
- Server-side cryptographic HMAC SHA256 signature verification (`/api/payments/verify`).
- Idempotent Webhook Handler (`/api/webhooks/razorpay`) with duplicate event detection.
- **Built-in Test Mode Simulator**: Allows end-to-end checkout and entitlement testing even without live gateway credentials plugged in.

### 4. Admin Dashboard (`/admin`)
- **Executive Analytics**: Gross sales vs net revenue (post-refunds), captured orders, active law students, and best-selling titles.
- **Product Management (`/admin/products`)**: Create, edit, set integer paise pricing, page counts, syllabus topics, and toggle featured/published status.
- **Category Management (`/admin/categories`)**: Manage subjects and display orders.
- **Order Management (`/admin/orders`)**: Audit verified gateway payment IDs and settlement statuses.
- **Portfolio & Bio Editor (`/admin/content`)**: Update hero headlines, chamber qualifications, and social media handles in real-time.

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 22)
- npm or pnpm

### 2. Installation
```bash
# Clone or navigate to project directory
cd "Portfolio Website"

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
*(Note: If you run without live API keys, the application automatically uses the resilient local database provider and test-mode payment simulator for zero-friction development!)*

### 4. Database Setup (Supabase)
1. Go to your Supabase project dashboard -> **SQL Editor**.
2. Run the migration script in:
   `supabase/migrations/20261021000000_init_lawyer_marketplace.sql`
3. Populate initial data by running:
   `supabase/seed.sql`
4. In **Storage**, ensure the following buckets are present:
   - `study-materials-private` (Private - for paid PDF compendiums)
   - `materials-public` (Public - for covers and previews)

### 5. Running the Application
```bash
# Start local development server
npm run dev

# Run automated test suite
npm test

# Build for production
npm run build
```

---

## Automated Tests
Run the test suite verifying payment security, signature checks, and validation schemas:
```bash
npm test
```
**Test Coverage Includes:**
- HMAC SHA256 payment signature verification and payload tampering detection
- Razorpay Webhook raw payload validation
- Empty/invalid credential rejection
- Zod schema integrity for paise pricing and order creation

---

## Production Security Best Practices

1. **Service Role Protection**: Never prefix `SUPABASE_SERVICE_ROLE_KEY` or `RAZORPAY_KEY_SECRET` with `NEXT_PUBLIC_`. They must remain strictly server-side.
2. **Authoritative Pricing**: The client never specifies prices; prices are resolved on the server from the `products` table before creating Razorpay orders.
3. **Signed URLs**: Paid PDFs are stored in a private Supabase bucket and served via 60-second time-limited signed URLs generated only after verifying user entitlements.
4. **Idempotent Webhooks**: All webhook events are logged in `webhook_events` to prevent duplicate entitlements from repeated gateway callbacks.
