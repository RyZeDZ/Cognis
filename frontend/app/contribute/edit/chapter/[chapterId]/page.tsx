// frontend/app/contribute/edit/chapter/[chapterId]/page.tsx

"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { Chapter } from "@/types";
import { Loader2, Save, Eye, Edit3, ArrowLeft } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import ImageUploadButton from "@/app/admin/upload/components/ImageUploadButton"; // Import the button

type PageProps = { params: Promise<{ chapterId: string }> };

export default function SuggestEditPage({ params }: PageProps) {
  const { chapterId } = use(params);
  const router = useRouter();
  const { isLoading: isAuthLoading } = useRequireAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Create a ref for the textarea to manage cursor position
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // This is a public endpoint, so no token is needed for initial fetch
        const res = await fetch(`${apiUrl}/api/chapters/${chapterId}`);
        if (!res.ok) throw new Error("Failed to fetch chapter data.");

        const chapter: Chapter = await res.json();
        setTitle(chapter.title);
        setContent(chapter.content);
        setSubjectId(chapter.subject_id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load chapter."
        );
      }
    };
    fetchChapterData();
  }, [chapterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const token = Cookies.get("access_token");
      if (!token)
        throw new Error("You must be logged in to submit a suggestion.");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${apiUrl}/api/contributions/chapters/${chapterId}/suggest-edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            proposed_title: title,
            proposed_content: content,
          }),
        }
      );
      const resData = await response.json();
      if (!response.ok)
        throw new Error(resData.detail || "Failed to submit suggestion.");

      setSuccess(
        "Suggestion submitted successfully! It is now pending review by an administrator."
      );
      setTimeout(() => router.push("/profile"), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || (!title && !error)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href={subjectId ? `/subjects/${subjectId}/chapters/${chapterId}` : "/"}
        className="inline-flex items-center gap-2 text-muted-accent hover:text-accent mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Chapter
      </Link>

      <h1 className="text-4xl font-bold">Suggest an Edit</h1>
      <p className="text-muted-accent -mt-2 mb-8">
        Your contribution will be reviewed by an administrator before being
        published.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-card-bg p-8 rounded-lg border-2 border-border"
      >
        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-md text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-muted-accent mb-2"
          >
            Chapter Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="content"
              className="text-sm font-medium text-muted-accent"
            >
              Chapter Content *
            </label>
            <div className="flex items-center gap-4">
              <ImageUploadButton
                setContent={setContent}
                onUploadError={(err) => setError(err)}
                chapterId={parseInt(chapterId)}
                textareaRef={contentTextareaRef}
              />
              <button
                type="button"
                onClick={() => setIsPreviewing(!isPreviewing)}
                className="text-xs text-muted-accent flex items-center gap-1 hover:text-accent"
              >
                {isPreviewing ? (
                  <>
                    <Edit3 size={14} /> Edit
                  </>
                ) : (
                  <>
                    <Eye size={14} /> Preview
                  </>
                )}
              </button>
            </div>
          </div>
          {isPreviewing ? (
            <div className="p-4 bg-primary border-2 border-border rounded-md min-h-[300px] prose prose-invert max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          ) : (
            <textarea
              ref={contentTextareaRef}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              required
              className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 font-mono text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none"
            />
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 flex items-center font-semibold text-primary bg-accent rounded-md disabled:opacity-50 disabled:cursor-wait"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />{" "}
                Submitting...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" /> Submit for Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
