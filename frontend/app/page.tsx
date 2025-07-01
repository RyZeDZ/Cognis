import type { Guide } from "../types";
import { Fragment } from "react";
import SubjectGrid from "./components/SubjectGrid";
import Link from "next/link";
import Image from "next/image";

async function getInitialSubjects() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/api/subjects`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch initial subjects:", error);
    return [];
  }
}

export default async function HomePage() {
  const initialSubjects = await getInitialSubjects();
  const recentGuides: Guide[] = [
    {
      id: 1,
      title: "Mastering Binary Search Trees",
      author: "Alex Johnson",
      date: "May 15, 2023",
      tag: "Data Structures",
    },
    {
      id: 2,
      title: "Understanding Big O Notation",
      author: "Sarah Miller",
      date: "April 22, 2023",
      tag: "Algorithms",
    },
    {
      id: 3,
      title: "Introduction to Neural Networks",
      author: "Michael Chen",
      date: "June 3, 2023",
      tag: "Machine Learning",
    },
  ];

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="container mx-auto px-4 py-16 text-center md:px-6 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="md:w-1/2 md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text">
              Welcome to <span className="text-accent">Cognis</span>.
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-accent max-w-xl mx-auto md:mx-0">
              Smarter notes for smarter minds. Your collaborative hub for all
              university CS subjects, powered by AI.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <Link
                href="#subjects"
                className="px-6 py-3 font-semibold text-primary bg-accent rounded-md hover:opacity-90 transition-opacity"
              >
                Explore Subjects
              </Link>
              <Link
                href="/guides"
                className="px-6 py-3 font-semibold text-text bg-card-bg rounded-md border border-border hover:bg-border transition-colors"
              >
                View Guides
              </Link>
            </div>
          </div>

          <div className="hidden md:block md:w-1/2">
            <Image
              src="/hello.svg"
              alt="An illustration of students learning or collaborating"
              width={500}
              height={400}
              className="mx-auto"
            />
          </div>
        </div>
      </section>
      {/* --- SUBJECTS SECTION --- */}
      <SubjectGrid initialSubjects={initialSubjects} />

      {/* --- RECENT GUIDES SECTION --- */}
      <section className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Recent Guides
          </h1>
          <Link href="/guides" className="text-sm text-accent hover:underline">
            View all guides →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentGuides.map((guide: Guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              className="flex flex-col h-full p-6 bg-card-bg border border-border rounded-lg hover:border-accent/50 transition-colors"
            >
              <p className="text-xs text-accent mb-2 font-medium">
                {guide.tag.toUpperCase()}
              </p>
              <h2 className="text-xl font-semibold text-text flex-grow">
                {guide.title}
              </h2>
              <div className="flex justify-between items-center text-xs text-muted-accent mt-4">
                <span>By {guide.author}</span>
                <span>{guide.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
