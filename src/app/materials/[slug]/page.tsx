import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getProfileContent } from "@/lib/supabase/data-service";
import BookCover from "@/components/materials/BookCover";
import PdfPreviewModal from "@/components/materials/PdfPreviewModal";
import ProductCard from "@/components/materials/ProductCard";
import { formatINR, calculateDiscount } from "@/lib/utils";
import Link from "next/link";
import {
  Star,
  CheckCircle,
  Clock,
  BookOpen,
  FileText,
  Lock,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Users,
  Download,
} from "lucide-react";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Study Material Not Found",
    };
  }

  return {
    title: `${product.title} | Adv. Harshal Kodgirwar`,
    description: product.short_description,
    openGraph: {
      title: product.title,
      description: product.short_description,
      type: "article",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const profile = await getProfileContent();
  const lawyerName = profile.name || "Adv. Harshal Kodgirwar";
  const initials = lawyerName
    .replace(/^Adv\.?\s+/i, "")
    .split(" ")
    .map((n: string) => n[0])
    .join("") || "HK";

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || p.is_featured))
    .slice(0, 3);

  const discount = calculateDiscount(product.original_price_paise, product.price_paise);

  return (
    <div className="bg-[#FDFBF7] text-[#1E2229] min-h-screen pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-[#080D1A] text-white py-8 border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-xs text-stone-400 space-x-2">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/materials" className="hover:text-white transition-colors">
              Study Materials
            </Link>
            <span>/</span>
            <span className="text-[#E5C378] truncate max-w-xs">{product.category?.name || "Notes"}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Book Cover & Quick Purchase Card (Desktop Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 self-start">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
              <div className="max-w-[280px] mx-auto">
                <BookCover
                  title={product.title}
                  category={product.category?.name}
                  pageCount={product.page_count}
                />
              </div>

              {/* Price & Primary Purchase Button */}
              <div className="pt-4 border-t border-stone-100 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl font-bold text-[#0B132B]">
                        {formatINR(product.price_paise)}
                      </span>
                      {product.original_price_paise && (
                        <span className="text-sm text-stone-400 line-through">
                          {formatINR(product.original_price_paise)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500">One-time purchase • Lifetime Library Access</span>
                  </div>

                  {discount > 0 && (
                    <span className="bg-[#B38A38] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <Link
                  href={`/checkout/${product.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#080D1A] font-bold text-sm shadow-lg hover:brightness-105 hover:scale-[1.01] transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Now & Instant Download</span>
                </Link>

                {/* Free Sample Excerpt Modal */}
                <PdfPreviewModal
                  title={product.title}
                  category={product.category?.name}
                  topics={product.topics}
                />

                {/* Trust Badges */}
                <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Instant access in 'My Library' post-payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Searchable, high-res printable PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Razorpay 256-bit encrypted checkout</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Credential Widget */}
            <div className="bg-[#0B132B] text-white p-5 rounded-2xl border border-[#C5A059]/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059] text-[#080D1A] font-serif font-bold text-base flex items-center justify-center">
                  {initials}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white">{lawyerName}</h4>
                  <p className="text-[11px] text-[#C5A059]">{profile.designation || "Supreme Court Advocate & Educator"}</p>
                </div>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Directly vetted and curated by {lawyerName} to ensure absolute conformity with the latest High Court and Supreme Court precedents.
              </p>
            </div>
          </div>

          {/* Right Column: Full Details, Curriculum & Learning Outcomes */}
          <div className="lg:col-span-8 space-y-10">
            {/* Title & Metadata Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs uppercase tracking-wider font-mono text-[#7C632C] bg-[#F7F3E8] px-2.5 py-1 rounded font-semibold">
                  {product.category?.name || "Legal Compendium"}
                </span>
                <span className="text-xs text-stone-500">•</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Updated for 2026
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating and Spec bar */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-600 pb-6 border-b border-stone-200">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400 font-normal ml-1">
                    ({product.reviews_count} verified student ratings)
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <FileText className="w-4 h-4 text-[#C5A059]" />
                  <span>{product.page_count} Pages</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-4 h-4 text-[#C5A059]" />
                  <span>{product.file_format}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-[#C5A059]" />
                  <span>{product.sales_count}+ Law Students Enrolled</span>
                </div>
              </div>
            </div>

            {/* Description Narrative */}
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0B132B]">
                About This Study Compendium
              </h2>
              <div className="w-10 h-0.5 bg-[#C5A059] mt-1.5 mb-4" />
              <div className="text-stone-700 text-sm leading-relaxed space-y-4 whitespace-pre-line font-light">
                {product.description}
              </div>
            </div>

            {/* Learning Outcomes */}
            {product.learning_outcomes && product.learning_outcomes.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#0B132B] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C5A059]" />
                  <span>Key Examination Outcomes</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700">
                  {product.learning_outcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Topics & Curriculum Covered */}
            {product.topics && product.topics.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#0B132B] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#C5A059]" />
                  <span>Curriculum & Topics Covered</span>
                </h3>
                <div className="space-y-3">
                  {product.topics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2"
                    >
                      <h4 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#F7F3E8] text-[#7C632C] font-mono text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{t.title}</span>
                      </h4>
                      {t.subtopics && t.subtopics.length > 0 && (
                        <ul className="pl-8 list-disc list-outside text-xs text-stone-600 space-y-1">
                          {t.subtopics.map((sub, sidx) => (
                            <li key={sidx}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intended Audience */}
            {product.target_audience && product.target_audience.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-serif text-base font-bold text-[#0B132B] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C5A059]" />
                  <span>Recommended For</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.target_audience.map((aud, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-xs font-medium text-stone-800"
                    >
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Study Materials */}
            {relatedProducts.length > 0 && (
              <div className="pt-8 border-t border-stone-200 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#0B132B]">
                    Complementary Study Compendiums
                  </h3>
                  <Link
                    href="/materials"
                    className="text-xs font-bold text-[#B38A38] hover:underline"
                  >
                    View All Materials
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedProducts.map((p, idx) => {
                    const variants = ["navy", "burgundy", "emerald"] as const;
                    return (
                      <ProductCard
                        key={p.id}
                        product={p}
                        variant={variants[idx % variants.length]}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
