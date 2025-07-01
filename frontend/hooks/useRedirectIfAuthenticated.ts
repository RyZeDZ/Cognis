"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  return { isLoading, isAuthenticated };
}
