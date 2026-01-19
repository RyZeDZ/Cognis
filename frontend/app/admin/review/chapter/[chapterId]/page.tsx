// frontend/app/admin/review/chapter/[chapterId]/page.tsx

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import type { Chapter } from "@/types";
import Cookies from "js-cookie";
import Link from "next/link";
import { Loader2, ArrowLeft, Check, X } from "lucide-react";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

type PageProps = { params: Promise<{ chapterId: string }> };

export default function ReviewNewChapterPage({ params }: PageProps) {
  const { chapterId } = use(params);
  const router = useRouter();
  const { isLoading: isAdminLoading } = useRequireAdmin();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("access_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // Call the new, secure admin endpoint to get the unpublished chapter
        const res = await fetch(
          `${apiUrl}/api/admin/review-item/chapter/${chapterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok)
          throw new Error("Failed to fetch chapter details for review.");
        setChapter(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChapterData();
  }, [chapterId]);

  const handleReview = async (action: "approve" | "reject" | "delete") => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      let endpoint = "";
      let method = "POST";

      if (action === "approve") {
        endpoint = `${apiUrl}/api/admin/approve-content/chapter/${chapterId}`;
      } else if (action === "reject") {
        // We will need a new "reject" endpoint for new content later.
        // For now, let's assume we are just deleting.
        endpoint = `${apiUrl}/api/admin/reject-content/chapter/${chapterId}`;
        method = "POST";
      } else if (action === "delete") {
        endpoint = `${apiUrl}/api/admin/submission/chapter/${chapterId}`;
        method = "DELETE";
      }

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || `Failed to ${action} content.`);
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

  if (error || !chapter) {
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error || "Could not load chapter for review."}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/admin/manage"
        className="inline-flex items-center gap-2 text-muted-accent hover:text-accent mb-8"
      >
        <ArrowLeft size={16} />
        Back to Review Queue
      </Link>

      <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold">
            Reviewing New Chapter Submission
          </h1>
          {/* We will need to fetch and display the user/subject data here later for more context */}
          <p className="text-sm text-muted-accent">
            Preview of the proposed chapter:{" "}
            <span className="font-semibold text-text">
              &quot;{chapter.title}&quot;
            </span>
          </p>
        </div>

        <div className="p-4 md:p-6">
          <MarkdownRenderer content={chapter.content} />
        </div>

        <div className="p-4 border-t border-border flex justify-end items-center gap-4">
          <button
            onClick={() => handleReview("reject")}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-md hover:bg-red-500/20 transition-colors"
          >
            <X size={16} /> Reject (Delete)
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
