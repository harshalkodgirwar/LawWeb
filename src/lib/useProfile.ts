"use client";

import { useState, useEffect } from "react";
import { SEED_PROFILE_CONFIG } from "@/lib/db/seed-data";

export type ProfileData = typeof SEED_PROFILE_CONFIG;

export function useProfile(): ProfileData {
  const [profile, setProfile] = useState<ProfileData>(SEED_PROFILE_CONFIG);

  useEffect(() => {
    // 1. Initial load from localStorage for instant client rendering
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin_profile_content");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile((prev) => ({ ...prev, ...parsed }));
        } catch {
          // ignore parsing error
        }
      }
    }

    // 2. Fetch latest from API endpoint
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) {
          setProfile((prev) => ({ ...prev, ...data.content }));
          if (typeof window !== "undefined") {
            localStorage.setItem("admin_profile_content", JSON.stringify(data.content));
          }
        }
      })
      .catch(() => {
        // use cached
      });

    // 3. Listen to live updates from admin dashboard in same tab or across tabs
    const handleUpdate = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("admin_profile_content");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setProfile((prev) => ({ ...prev, ...parsed }));
          } catch {
            // ignore
          }
        }
      }
    };

    window.addEventListener("admin_content_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("admin_content_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return profile;
}
