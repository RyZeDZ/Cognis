// frontend/app/subjects/[id]/chapters/[chapterId]/page.tsx

"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Loader2, PanelLeft, PanelRight, Download, Edit } from "lucide-react";
import type { Subject, Chapter } from "@/types";
import { slugify, getHeadingsFromMarkdown } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebarStore";
import { useAuthStore } from "@/store/authStore";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

type PageProps = { params: Promise<{ id: string; chapterId: string }> };
type PageData = { subject: Subject; chapter: Chapter & { content: string } };

// --- Reusable Sidebar Content Component (Corrected) ---
function SidebarContent({
  subject,
  activeChapterId,
  activeChapterContent,
}: {
  subject: Subject;
  activeChapterId: number;
  activeChapterContent: string;
}) {
  const { close: closeSidebar } = useSidebarStore();

  return (
    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4">
        <h3 className="font-bold text-lg mb-4">{subject.name}</h3>
        <ul className="space-y-1">
          {subject.chapters.map((chap) => {
            const isActive = chap.id === activeChapterId;
            const headings = isActive
              ? getHeadingsFromMarkdown(activeChapterContent)
              : [];

            return (
              <li key={chap.id}>
                <Link
                  href={`/subjects/${subject.id}/chapters/${chap.id}`}
                  onClick={() => {
                    if (window.innerWidth < 768) closeSidebar();
                  }}
                  className={`flex justify-between items-center p-2 rounded-md transition-colors text-sm ${
                    isActive
                      ? "bg-accent text-primary font-semibold"
                      : "text-muted-accent hover:bg-card-bg"
                  }`}
                >
                  {chap.title}
                </Link>
                {isActive && headings.length > 0 && (
                  <ul className="pl-4 mt-2 space-y-2 border-l border-border ml-2">
                    {headings.map((heading, index) => (
                      <li key={index}>
                        <a
                          href={`#${slugify(heading)}`}
                          className="text-xs text-muted-accent hover:text-text"
                          onClick={() => {
                            if (window.innerWidth < 768) closeSidebar();
                          }}
                        >
                          {heading}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

// --- Main Page Component (Corrected) ---
export default function ChapterViewPage({ params }: PageProps) {
  const { id, chapterId } = use(params);
  const {
    isOpen: isSidebarOpen,
    toggle: toggleSidebar,
    close: closeSidebar,
  } = useSidebarStore();
  const { isAuthenticated } = useAuthStore();

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/api/subjects/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);

        const subjectData: Subject = await res.json();
        const currentChapter = subjectData.chapters.find(
          (c) => c.id.toString() === chapterId
        ) as Chapter & { content: string };

        if (!currentChapter) throw new Error("Chapter not found");

        setPageData({ subject: subjectData, chapter: currentChapter });
      } catch (err) {
        console.error(err);
        setPageData(null);
      } finally {
        setIsLoading(false);
      }
    }

    const trackVisit = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // Use the 'id' (subject_id) from params
        await fetch(`${apiUrl}/api/utils/track-visit/subject/${id}`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to track visit:", error);
      }
    };

    fetchData();
    trackVisit();
  }, [id, chapterId]);

  const handleDownload = async () => {
    if (!pageData) return;
    setIsDownloading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/utils/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          markdown_content: pageData.chapter.content,
          title: pageData.chapter.title,
        }),
      });
      if (!response.ok) throw new Error("PDF generation failed.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${pageData.chapter.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }
  if (!pageData) {
    return (
      <div className="text-center py-20 text-red-500">
        Error: Could not load page data.
      </div>
    );
  }
  const { subject, chapter } = pageData;

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed bottom-5 right-5 z-50 p-3 rounded-full bg-accent text-primary shadow-lg hover:opacity-90 transition-transform hover:scale-110"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? <PanelLeft size={20} /> : <PanelRight size={20} />}
      </button>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block transition-all duration-300 border-r border-border ${
            isSidebarOpen ? "w-1/4 lg:w-1/5 min-w-[250px]" : "w-0"
          }`}
        >
          <div className={`h-full ${isSidebarOpen ? "" : "hidden"}`}>
            <SidebarContent
              subject={subject}
              activeChapterId={chapter.id}
              activeChapterContent={chapter.content}
            />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <div
          className={`md:hidden fixed inset-y-0 left-0 z-40 transition-transform duration-300 w-3/4 bg-primary border-r border-border ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            subject={subject}
            activeChapterId={chapter.id}
            activeChapterContent={chapter.content}
          />
        </div>
        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-30"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
            <h1 className="prose prose-invert text-3xl sm:text-4xl font-bold">
              {chapter.title}
            </h1>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAuthenticated && (
                <Link
                  href={`/contribute/edit/chapter/${chapter.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border rounded-md text-sm text-muted-accent hover:bg-border hover:text-accent transition-colors"
                >
                  <Edit size={16} />
                  Suggest an Edit
                </Link>
              )}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-border rounded-md text-sm text-muted-accent hover:bg-border hover:text-accent disabled:opacity-50 disabled:cursor-wait"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Generating...
                  </>
                ) : (
                  <>
                    <Download size={16} /> Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
          <MarkdownRenderer content={chapter.content} />
        </main>
      </div>
    </>
  );
}
