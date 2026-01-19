"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useRequireAdmin() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user?.is_admin) {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return { isLoading, isAdmin: user?.is_admin ?? false };
}
