import React from "react";
import { Metadata } from "next";
import { getProfileContent } from "@/lib/supabase/data-service";
import AboutClient from "@/components/about/AboutClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Adv. Harshal Kodgirwar | Background & Legal Pedagogy",
  description:
    "Learn about Adv. Harshal Kodgirwar's litigation practice before the Supreme Court and High Court, academic background, and legal content creation journey.",
};

export default async function AboutPage() {
  const profile = await getProfileContent();
  return <AboutClient initialProfile={profile} />;
}
