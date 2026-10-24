import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format paise into Indian Rupee string (e.g. 49900 paise -> "₹499")
 */
export function formatINR(paise: number | bigint | null | undefined): string {
  if (paise === null || paise === undefined) return "₹0";
  const rupees = Number(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}

/**
 * Format date in legal/editorial format (e.g. "21 Oct 2026")
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPaise: number | null | undefined, currentPaise: number): number {
  if (!originalPaise || originalPaise <= currentPaise) return 0;
  return Math.round(((originalPaise - currentPaise) / originalPaise) * 100);
}
