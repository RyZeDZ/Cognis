"use client";

import { useRef } from "react";
import { useAuthStore } from "./authStore";
import type { User } from "@/types";

function StoreInitializer({ user }: { user: User | null }) {
  const initialized = useRef(false);

  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading && !initialized.current) {
    useAuthStore.setState({ user, isAuthenticated: !!user, isLoading: false });
    initialized.current = true;
  }

  return null;
}

export default StoreInitializer;
