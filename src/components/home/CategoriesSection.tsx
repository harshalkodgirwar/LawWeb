import React from "react";
import Link from "next/link";
import { Category } from "@/lib/db/types";
import { Scale, Shield, BookOpen, Award, FileText, Briefcase, Bookmark, GraduationCap, ArrowUpRight } from "lucide-react";

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const getIcon = (iconName?: string | null) => {
    switch (iconName) {
      case "Shield":
        return <Shield className="w-5 h-5" />;
      case "Scale":
        return <Scale className="w-5 h-5" />;
      case "BookOpen":
        return <BookOpen className="w-5 h-5" />;
      case "Award":
        return <Award className="w-5 h-5" />;
      case "FileText":
        return <FileText className="w-5 h-5" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5" />;
      case "Bookmark":
        return <Bookmark className="w-5 h-5" />;
      case "GraduationCap":
      default:
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-20 bg-[#F6F3EB] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B38A38] font-bold font-mono">
            Syllabus-Aligned Taxonomies
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B132B] mt-2">
            Categories of Legal Resources
          </h2>
          <p className="text-stone-600 text-sm mt-3">
            Every subject is broken down into structured conceptual modules with case citations, legislative amendments, and comparative tables.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/materials?cat=${cat.slug}`}
              className="group p-6 rounded-xl bg-white border border-stone-200/90 hover:border-[#C5A059] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0B132B] text-[#E5C378] border border-[#C5A059]/40 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  {getIcon(cat.icon)}
                </div>
                <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-[#0B132B] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description || "Master notes, case summaries, and exam templates."}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#B38A38] group-hover:text-[#0B132B]">
                <span>Explore Subject</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
