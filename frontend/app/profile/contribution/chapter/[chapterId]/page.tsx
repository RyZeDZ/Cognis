"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Info, PanelLeft, PanelRight } from "lucide-react";
import type { Chapter, Subject } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import Cookies from "js-cookie";
import { useSidebarStore } from "@/store/sidebarStore";

// --- Reusable Sidebar Content ---
// This is a simplified version for the preview.
function PreviewSidebarContent({
  subject,
  activeChapterId,
  proposedTitle,
}: {
  subject: Subject;
  activeChapterId: number;
  proposedTitle: string;
}) {
  return (
    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4">
        <h3 className="font-bold text-lg mb-4">{subject.name}</h3>
        <ul className="space-y-1">
          {subject.chapters.map((chap) => {
            const isActive = chap.id === activeChapterId;
            // For the active chapter, display the user's proposed title
            const displayTitle = isActive ? proposedTitle : chap.title;

            return (
              <li key={chap.id}>
                <span
                  className={`flex justify-between items-center p-2 rounded-md text-sm cursor-not-allowed ${
                    isActive
                      ? "bg-accent text-primary font-semibold"
                      : "text-muted-accent"
                  }`}
                >
                  {displayTitle}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

type PageProps = { params: Promise<{ chapterId: string }> };

export default function ContributionPreviewPage({ params }: PageProps) {
  const { chapterId } = use(params);
  const { isLoading: isAuthLoading } = useRequireAuth();

  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebarStore();
  const [request, setRequest] = useState<Chapter | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null); // State for the full subject
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("access_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // 1. Fetch the modification request
        const reqRes = await fetch(
          `${apiUrl}/api/contributions/my/chapter/${chapterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!reqRes.ok)
          throw new Error("Failed to fetch contribution details.");
        const requestData: Chapter = await reqRes.json();
        setRequest(requestData);

        // 2. Use the subject_id from the request to fetch the full subject
        const subjectRes = await fetch(
          `${apiUrl}/api/subjects/${requestData.subject_id}`
        );
        if (!subjectRes.ok)
          throw new Error("Failed to fetch subject details for preview.");
        const subjectData: Subject = await subjectRes.json();
        setSubject(subjectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [chapterId]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !request || !subject) {
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error || "Could not load your contribution preview."}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed bottom-5 right-5 z-50 p-3 rounded-full bg-accent text-primary shadow-lg hover:opacity-90 transition-transform hover:scale-110"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <PanelLeft size={20} /> : <PanelRight size={20} />}
      </button>

      <div className="sticky top-0 bg-yellow-500/10 text-yellow-300 text-sm text-center p-3 flex items-center justify-center gap-2 border-b border-yellow-500/20 z-10 backdrop-blur-sm">
        <Info size={16} />
        This is a preview of your suggested edit. This is not the live content.
      </div>

      <div className="flex">
        {/* The Sidebar - now with the full subject data */}
        <aside
          className={`hidden md:block transition-all duration-300 border-r border-border ${
            isSidebarOpen ? "w-1/4 lg:w-1/5 min-w-[250px]" : "w-0"
          }`}
        >
          <div
            className={`h-full overflow-hidden ${
              isSidebarOpen ? "" : "hidden"
            }`}
          >
            <PreviewSidebarContent
              subject={subject}
              activeChapterId={request.id}
              proposedTitle={request.title}
            />
          </div>
        </aside>

        {/* Main Content using the PROPOSED content */}
        <main className="flex-grow p-4 md:p-8 w-full">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-muted-accent hover:text-accent mb-8"
          >
            <ArrowLeft size={16} />
            Back to My Contributions
          </Link>
          <h1 className="prose prose-invert text-3xl sm:text-4xl font-bold mb-6">
            {request.title}
          </h1>
          <MarkdownRenderer content={request.content} />
        </main>
      </div>
    </>
  );
}
