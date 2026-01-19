"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import type { Resource } from "@/types";
import Cookies from "js-cookie";
import Link from "next/link";
import { Loader2, ArrowLeft, Check, X, Link as LinkIcon } from "lucide-react";

type PageProps = { params: Promise<{ resourceId: string }> };

export default function ReviewNewResourcePage({ params }: PageProps) {
  const { resourceId } = use(params);
  const router = useRouter();
  const { isLoading: isAdminLoading } = useRequireAdmin();
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResourceData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("access_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(
          `${apiUrl}/api/admin/review-item/resource/${resourceId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch resource details.");
        setResource(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResourceData();
  }, [resourceId]);

  const handleReview = async (action: "approve" | "reject") => {
    setIsLoading(true);
    try {
      const token = Cookies.get("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint =
        action === "approve"
          ? `${apiUrl}/api/admin/approve-content/resource/${resourceId}`
          : `${apiUrl}/api/admin/reject-content/resource/${resourceId}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Failed to ${action} resource.`);
      router.push("/admin/manage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
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

  if (error || !resource) {
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error || "Could not load resource for review."}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/admin/manage"
        className="inline-flex items-center gap-2 text-muted-accent hover:text-accent mb-8"
      >
        <ArrowLeft size={16} /> Back to Review Queue
      </Link>
      <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold">Reviewing New Resource</h1>
          <p className="text-sm text-muted-accent">
            &quot;{resource.title}&quot; submitted by{" "}
            <span className="font-semibold text-text">
              {resource.user.username}
            </span>
          </p>
        </div>
        <div className="p-8 text-center">
          <a
            href={resource.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-accent text-primary rounded-md font-semibold hover:opacity-90 transition-opacity"
          >
            <LinkIcon size={20} /> Test Resource Link
          </a>
          <p className="text-xs text-muted-accent mt-4">
            This will open the link ({resource.link_url}) in a new tab.
          </p>
        </div>
        <div className="p-4 border-t border-border flex justify-end items-center gap-4">
          <button
            onClick={() => handleReview("reject")}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-md hover:bg-red-500/20"
          >
            <X size={16} /> Reject (Delete)
          </button>
          <button
            onClick={() => handleReview("approve")}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-md hover:bg-green-500/20"
          >
            <Check size={16} /> Approve & Publish
          </button>
        </div>
      </div>
    </div>
  );
}
