"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLoginPortal from "@/components/admin/AdminLoginPortal";
import { getCurrentUser, checkIsAdmin } from "@/lib/auth-helpers";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (checkIsAdmin(user)) {
      router.replace("/admin");
    }
  }, [router]);

  return <AdminLoginPortal onSuccess={() => router.push("/admin")} />;
}
