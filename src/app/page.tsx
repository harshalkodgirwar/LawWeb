import React from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedMaterials from "@/components/home/FeaturedMaterials";
import CategoriesSection from "@/components/home/CategoriesSection";
import JourneySection from "@/components/home/JourneySection";
import FreeResourcesSection from "@/components/home/FreeResourcesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import { getCategories, getProducts, getProfileContent } from "@/lib/supabase/data-service";
import Link from "next/link";
import { Mail, MessageSquare, ArrowRight, ShieldCheck, Scale } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await getCategories();
  const products = await getProducts({ isFeatured: true });
  const profile = await getProfileContent();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection profile={profile} />

      {/* 2. Featured Study Materials */}
      <FeaturedMaterials products={products} />

      {/* 3. Categories of Legal Educational Resources */}
      <CategoriesSection categories={categories} />

      {/* 4. Journey & Pedagogical Mission & Social Media */}
      <JourneySection />

      {/* 5. Free Resources Section */}
      <FreeResourcesSection />

      {/* 6. Student Testimonials */}
      <TestimonialsSection />

      {/* 7. FAQs */}
      <FaqSection />

      {/* 8. Pre-Footer Contact Callout */}
      <section className="py-16 bg-[#0B132B] text-white border-t border-[#C5A059]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#1C2541] border border-[#C5A059] flex items-center justify-center text-[#E5C378] mx-auto mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Have Questions About Study Modules or Mentorship?
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
            Reach out directly to {profile?.name || "Adv. Harshal"}'s academic and support desk for guidance on recommended study sequences, institutional access, or technical download assistance.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#080D1A] text-xs font-bold shadow-lg hover:brightness-105 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Academic Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/materials"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1C2541] border border-[#C5A059]/40 text-stone-200 text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
