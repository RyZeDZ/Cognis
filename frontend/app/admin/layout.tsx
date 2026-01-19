"use client";

import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAdmin } = useRequireAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <Loader2 className="h-12 w-12 animate-spin text-accent" />
    </div>
  );
}
