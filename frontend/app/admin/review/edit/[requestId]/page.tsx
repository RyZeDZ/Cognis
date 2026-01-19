// frontend/app/admin/review/[requestId]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import type { ModificationRequest } from "@/types";
import Cookies from "js-cookie";
import Link from "next/link";
import { Loader2, ArrowLeft, Check, X } from "lucide-react";
import CustomDiffViewer from "@/app/components/CustomDiffViewer"; // <-- IMPORT OUR OWN COMPONENT

type PageProps = { params: Promise<{ requestId: string }> };

export default function ReviewPage({ params }: PageProps) {
  const { requestId } = use(params);
  const router = useRouter();
  const { isLoading: isAdminLoading } = useRequireAdmin();

  const [request, setRequest] = useState<ModificationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("access_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/contributions/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch request details.");
        setRequest(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequestData();
  }, [requestId]);

  const handleReview = async (action: "approve" | "reject") => {
    setIsLoading(true);
    try {
      const token = Cookies.get("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${apiUrl}/api/contributions/${requestId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body:
            action === "reject"
              ? JSON.stringify({ comment: "Rejected by admin." })
              : undefined,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || `Failed to ${action} request.`);
      }

      router.push("/admin/manage");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during review."
      );
      setIsLoading(false);
    }
  };

  if (isAdminLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error || "Could not load request."}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <Link
        href="/admin/manage"
        className="inline-flex items-center gap-2 text-muted-accent hover:text-accent mb-8"
      >
        <ArrowLeft size={16} />
        Back to Review Queue
      </Link>

      <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold">Reviewing Suggestion</h1>
          <p className="text-sm text-muted-accent">
            For chapter{" "}
            <span className="font-semibold text-text">
              {request.chapter.title}
            </span>{" "}
            by{" "}
            <span className="font-semibold text-text">
              {request.user.username}
            </span>
          </p>
        </div>

        {/* --- Using our new, simple, reliable component --- */}
        <CustomDiffViewer
          oldContent={request.chapter.content || ""}
          newContent={request.proposed_content || ""}
        />

        <div className="p-4 border-t border-border flex justify-end items-center gap-4">
          <button
            onClick={() => handleReview("reject")}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-md hover:bg-red-500/20 transition-colors"
          >
            <X size={16} /> Reject
          </button>
          <button
            onClick={() => handleReview("approve")}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-md hover:bg-green-500/20 transition-colors"
          >
            <Check size={16} /> Approve & Publish
          </button>
        </div>
      </div>
    </div>
  );
}
