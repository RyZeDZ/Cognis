"use client";

import { useEffect, useState, use } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Loader2, PanelLeft, PanelRight } from "lucide-react";
import type { Guide } from "@/types";
import { slugify, getHeadingsFromMarkdown } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebarStore";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import "highlight.js/styles/github-dark.css";

const allGuides: (Guide & { content: string })[] = [
  {
    id: 1,
    title: "Mastering Binary Search Trees",
    author: "Alex Johnson",
    date: "May 15, 2023",
    tag: "Data Structures",
    content:
      "## Introduction to Trees\n\nA tree is a widely used abstract data type...",
  },
  {
    id: 2,
    title: "Understanding Big O Notation",
    author: "Sarah Miller",
    date: "April 22, 2023",
    tag: "Algorithms",
    content:
      "## What is Big O?\n\nIt is essential for analyzing algorithm efficiency...",
  },
  {
    id: 3,
    title: "Introduction to Neural Networks",
    author: "Michael Chen",
    date: "June 3, 2023",
    tag: "Machine Learning",
    content: "## The Perceptron\n\nThe simplest neural network...",
  },
  {
    id: 4,
    title: "A Practical Guide to Git and GitHub",
    author: "Jane Doe",
    date: "July 1, 2023",
    tag: "Tools",
    content:
      "## Basic Git Commands\n\n- `git init`\n- `git add`\n- `git commit`",
  },
  {
    id: 5,
    title: "Preparing for Technical Interviews",
    author: "John Smith",
    date: "August 5, 2023",
    tag: "Career",
    content: "## The STAR Method\n\nSituation, Task, Action, Result...",
  },
  {
    id: 6,
    title: "Setting up your VS Code for C++",
    author: "Emily White",
    date: "March 10, 2023",
    tag: "Tools",
    content:
      "## Must-Have Extensions\n\n1. C/C++ Extension Pack\n2. CMake Tools\n\n## Optional Extensions\n\n1. Code Runner\n2. C++ Debugger\n\n## Getting Started\n\n1. Install the extensions\n2. Configure the settings...",
  },
  {
    id: 7,
    title: "The OSI Model Explained",
    author: "David Green",
    date: "September 12, 2023",
    tag: "Networking",
    content:
      "## Layer 7: Application Layer\n\nThis is the layer closest to the end user...",
  },
  {
    id: 8,
    title: "Linear Algebra for Machine Learning",
    author: "Sophia Black",
    date: "October 20, 2023",
    tag: "Machine Learning",
    content:
      "## Vectors and Matrices\n\nUnderstanding vectors is fundamental...",
  },
];

type PageProps = { params: Promise<{ guideId: string }> };

function GuideSidebarContent({
  guide,
}: {
  guide: Guide & { content: string };
}) {
  const headings = getHeadingsFromMarkdown(guide.content || "");
  const closeSidebar = useSidebarStore((state) => state.close);

  return (
    <nav className="p-4">
      <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
      {headings.length > 0 ? (
        <ul className="space-y-2 border-l border-border ml-2">
          {headings.map((heading, index) => (
            <li key={index}>
              <a
                href={`#${slugify(heading)}`}
                className="pl-2 text-sm text-muted-accent hover:text-text"
                onClick={() => {
                  if (window.innerWidth < 768) closeSidebar();
                }}
              >
                {heading}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-accent">No sections found.</p>
      )}
    </nav>
  );
}

export default function GuideViewPage({ params }: PageProps) {
  const { guideId } = use(params);

  const [guide, setGuide] = useState<(Guide & { content: string }) | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    isOpen: isSidebarOpen,
    toggle: toggleSidebar,
    close: closeSidebar,
  } = useSidebarStore();

  useEffect(() => {
    setIsLoading(true);
    try {
      const currentGuide = allGuides.find((g) => g.id.toString() === guideId);
      if (currentGuide) {
        setGuide(currentGuide);
        setError(null);
      } else {
        throw new Error("Guide not found");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setGuide(null);
    } finally {
      setIsLoading(false);
    }
  }, [guideId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="text-center py-20 text-red-500">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>{error || "Could not load the guide."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex min-h-screen">
        {/* Universal Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-5 left-5 z-70 p-3 rounded-full bg-accent text-primary shadow-lg hover:opacity-90 transition-transform hover:scale-110"
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <PanelLeft size={20} /> : <PanelRight size={20} />}
        </button>

        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 overflow-hidden border-r border-border ${
            isSidebarOpen ? "w-1/4 lg:w-1/5 min-w-[250px]" : "w-0"
          }`}
        >
          <div className="h-full overflow-y-auto">
            <GuideSidebarContent guide={guide} />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <div
          className={`md:hidden fixed inset-y-0 left-0 z-60 transition-transform duration-300 w-3/4 bg-primary border-r border-border ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <GuideSidebarContent guide={guide} />
        </div>
        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-30"
            onClick={closeSidebar}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8 w-full">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm text-muted-accent hover:text-accent mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all guides
          </Link>
          <article className="prose prose-invert max-w-none">
            <h1>{guide.title}</h1>
            <div className="text-muted-accent text-sm mb-8 border-b border-border pb-4">
              <span>By {guide.author}</span> |{" "}
              <span>Published on {guide.date}</span>
            </div>

            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h2: ({ node, ...props }) => {
                  const id = slugify(props.children?.toString() || "");
                  return <h2 id={id} {...props}></h2>;
                },
              }}
            >
              {guide.content}
            </Markdown>
          </article>
        </main>
      </div>
    </>
  );
}
