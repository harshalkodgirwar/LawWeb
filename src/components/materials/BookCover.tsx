import React from "react";
import { Scale, BookOpen, Shield, Award, Briefcase, FileText } from "lucide-react";

interface BookCoverProps {
  title: string;
  category?: string;
  pageCount?: number | null;
  className?: string;
  variant?: "navy" | "burgundy" | "emerald" | "charcoal";
  author?: string;
}

export default function BookCover({
  title,
  category = "Judicial Series",
  pageCount,
  className = "",
  variant = "navy",
  author = "Adv. Harshal Kodgirwar",
}: BookCoverProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "burgundy":
        return {
          bg: "bg-gradient-to-br from-[#3E0A12] via-[#5C1D24] to-[#25050A]",
          spine: "border-l-4 border-[#782832]",
          accent: "text-[#E5C378]",
        };
      case "emerald":
        return {
          bg: "bg-gradient-to-br from-[#062419] via-[#0D3B2B] to-[#041710]",
          spine: "border-l-4 border-[#1B5E46]",
          accent: "text-[#E5C378]",
        };
      case "charcoal":
        return {
          bg: "bg-gradient-to-br from-[#181B20] via-[#242933] to-[#121418]",
          spine: "border-l-4 border-[#3D4554]",
          accent: "text-[#C5A059]",
        };
      case "navy":
      default:
        return {
          bg: "bg-gradient-to-br from-[#080D1A] via-[#0B132B] to-[#1C2541]",
          spine: "border-l-4 border-[#3A506B]",
          accent: "text-[#C5A059]",
        };
    }
  };

  const style = getVariantStyles();

  return (
    <div
      className={`relative aspect-[3/4] w-full rounded-md p-4 text-white shadow-xl flex flex-col justify-between overflow-hidden select-none transition-transform duration-300 group-hover:scale-[1.02] ${style.bg} ${style.spine} ${className}`}
    >
      {/* Embossed Paper Texture Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/40 pointer-events-none" />

      {/* Gold Foil Double Frame Border */}
      <div className="absolute inset-2.5 border border-[#C5A059]/40 rounded-sm pointer-events-none" />
      <div className="absolute inset-3.5 border border-[#C5A059]/20 rounded-sm pointer-events-none" />

      {/* Header Emblem & Series Tag */}
      <div className="relative z-10 flex items-center justify-between pt-1 px-1">
        <span className="text-[10px] uppercase tracking-widest font-mono text-[#E5C378]/90 font-medium bg-[#0B132B]/80 px-2 py-0.5 rounded border border-[#C5A059]/30">
          {category}
        </span>
        <div className="h-6 w-6 rounded-full border border-[#C5A059]/40 flex items-center justify-center bg-[#0B132B]/60 text-[#C5A059]">
          <Scale className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Center Title & Crest */}
      <div className="relative z-10 my-auto text-center px-3 py-2">
        <div className="w-8 h-8 mx-auto mb-2.5 rounded-full border border-[#C5A059]/60 flex items-center justify-center bg-black/30 shadow-inner">
          <BookOpen className="w-4 h-4 text-[#C5A059]" />
        </div>
        <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold leading-snug tracking-wide text-white drop-shadow-sm line-clamp-3">
          {title}
        </h3>
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mt-2" />
        <p className="text-[11px] font-serif italic text-[#E5C378]/80 mt-1.5">
          {author}
        </p>
      </div>

      {/* Footer Credentials & Format */}
      <div className="relative z-10 flex items-center justify-between text-[9px] uppercase tracking-wider text-slate-300/80 px-1 border-t border-[#C5A059]/25 pt-2">
        <span className="font-semibold text-[#E5C378]">Official Edition</span>
        {pageCount ? <span>{pageCount} Pages • PDF</span> : <span>Searchable PDF</span>}
      </div>

      {/* Book 3D Sheen Highlight */}
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
