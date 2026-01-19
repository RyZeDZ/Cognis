// frontend/app/admin/manage/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import type { Subject, PendingItem } from "@/types";
import { Loader2, Trash2, Edit, FileText, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";

// Helper function to format the item type for display
const formatItemType = (type: string) => {
  return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function ManageContentPage() {
  const { isLoading: isAdminLoading, isAdmin } = useRequireAdmin();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [reviewQueue, setReviewQueue] = useState<PendingItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const fetchAllContent = useCallback(async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) throw new Error("Authentication token not found.");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/subjects/all-with-content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok)
        throw new Error(
          "Failed to fetch content. You may not have admin privileges."
        );
      const data: Subject[] = await res.json();
      setSubjects(data);
      if (data.length > 0 && !selectedSubject) {
        setSelectedSubject(data[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching subjects."
      );
    }
  }, [selectedSubject]);

  const fetchReviewQueue = useCallback(async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) throw new Error("Authentication token not found.");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/contributions/review-queue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch review queue.");
      const data = await res.json();
      setReviewQueue(data.items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching queue."
      );
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      setIsLoading(true);
      Promise.all([fetchAllContent(), fetchReviewQueue()]).finally(() =>
        setIsLoading(false)
      );
    }
  }, [isAdmin, fetchAllContent, fetchReviewQueue]);

  const handleDeleteChapter = async (chapterId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this chapter? This cannot be undone."
      )
    )
      return;
    setError(null);
    try {
      const token = Cookies.get("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/chapters/${chapterId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to delete chapter.");
      }
      // Refresh content list to show the change
      fetchAllContent();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during deletion."
      );
    }
  };

  if (isAdminLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Manage Content</h1>
        <p className="text-muted-accent mt-2">
          Browse existing content and review community contributions.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      <Tabs.Root defaultValue="browse" className="w-full">
        <Tabs.List className="flex border-b border-border mb-8">
          <Tabs.Trigger
            value="browse"
            className="data-[state=active]:border-accent data-[state=active]:text-accent text-muted-accent border-b-2 border-transparent px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            Browse All Content
          </Tabs.Trigger>
          <Tabs.Trigger
            value="review"
            className="data-[state=active]:border-accent data-[state=active]:text-accent text-muted-accent border-b-2 border-transparent px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            Review Queue
            {reviewQueue.length > 0 && (
              <span className="ml-2 bg-accent text-primary text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {reviewQueue.length}
              </span>
            )}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="browse">
          {isLoading && subjects.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <aside className="w-full md:w-1/3 lg:w-1/4">
                <div className="sticky top-24">
                  <h2 className="text-lg font-semibold mb-4 px-3">Subjects</h2>
                  <div className="space-y-1 h-[60vh] overflow-y-auto pr-2 border-r border-border scrollbar-thin scrollbar-thumb-border scrollbar-track-primary hover:scrollbar-thumb-accent">
                    {subjects.map((subject) => (
                      <button
                        key={subject.id}
                        onClick={() => setSelectedSubject(subject)}
                        className={`w-full text-left p-3 rounded-md transition-colors text-sm flex justify-between items-center ${
                          selectedSubject?.id === subject.id
                            ? "bg-accent text-primary font-semibold"
                            : "text-text hover:bg-card-bg"
                        }`}
                      >
                        <span>{subject.name}</span>
                        {selectedSubject?.id === subject.id && (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
              <main className="w-full md:w-2/3 lg:w-3/4">
                {selectedSubject ? (
                  <div className="bg-card-bg border border-border rounded-lg">
                    <div className="flex justify-between items-center p-4 border-b border-border">
                      <div>
                        <Link
                          href={`/subjects/${selectedSubject.id}`}
                          target="_blank"
                          className="text-2xl font-bold hover:text-accent hover:underline"
                        >
                          {selectedSubject.name}
                        </Link>
                        <p className="text-sm text-muted-accent">
                          {selectedSubject.chapters.length} chapters
                        </p>
                      </div>
                      <Link
                        href={`/admin/edit/subject/${selectedSubject.id}`}
                        className="text-sm text-muted-accent hover:text-accent flex items-center gap-2 border border-border px-3 py-1 rounded-md hover:border-accent"
                      >
                        <Edit size={14} /> Edit Subject
                      </Link>
                    </div>
                    {selectedSubject.chapters &&
                    selectedSubject.chapters.length > 0 ? (
                      <ul className="divide-y divide-border">
                        {selectedSubject.chapters.map((chapter) => (
                          <li
                            key={chapter.id}
                            className="flex justify-between items-center p-4 group"
                          >
                            <div className="flex items-center gap-3">
                              <FileText
                                size={16}
                                className="text-muted-accent"
                              />
                              <Link
                                href={`/subjects/${selectedSubject.id}/chapters/${chapter.id}`}
                                target="_blank"
                                className="text-text group-hover:text-accent group-hover:underline"
                              >
                                {chapter.title}
                              </Link>
                            </div>
                            <div className="flex items-center gap-4">
                              <Link
                                href={`/admin/edit/chapter/${chapter.id}`}
                                className="text-sm text-muted-accent hover:text-accent"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteChapter(chapter.id)}
                                className="p-1 text-red-500 hover:text-text hover:bg-red-500/20 rounded-md"
                                title="Delete Chapter"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-muted-accent">
                          This subject has no chapters.
                        </p>
                        <Link
                          href="/admin/upload"
                          className="mt-4 inline-block text-accent hover:underline"
                        >
                          Add the first chapter
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full text-muted-accent p-16 bg-card-bg rounded-lg border-2 border-dashed border-border">
                    <p>Select a subject from the list to manage its content.</p>
                  </div>
                )}
              </main>
            </div>
          )}
        </Tabs.Content>

        <Tabs.Content value="review">
          <div className="bg-card-bg border border-border rounded-lg">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : reviewQueue.length > 0 ? (
              <ul className="divide-y divide-border">
                {reviewQueue.map((item) => {
                  let reviewLink = "";
                  if (item.item_type === "edit") {
                    reviewLink = `/admin/review/edit/${item.item_id}`;
                  } else {
                    const type = item.item_type.replace("new_", "");
                    reviewLink = `/admin/review/${type}/${item.item_id}`;
                  }
                  return (
                    <li
                      key={`${item.item_type}-${item.item_id}`}
                      className="p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-text">{item.title}</p>
                        <p className="text-sm text-muted-accent">
                          {formatItemType(item.item_type)} for{" "}
                          <span className="font-medium text-text">
                            {item.subject_name}
                          </span>{" "}
                          by{" "}
                          <span className="font-medium text-text">
                            {item.user.username}
                          </span>
                        </p>
                      </div>
                      <Link
                        href={reviewLink}
                        className="px-4 py-2 text-sm font-semibold text-primary bg-accent rounded-md hover:opacity-90"
                      >
                        Review
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-16 text-muted-accent">
                <p className="text-lg font-semibold">
                  The review queue is empty.
                </p>
                <p>Great job!</p>
              </div>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
