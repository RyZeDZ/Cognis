import type { Subject } from "@/types";
import { formatYear } from "@/lib/utils";
import Link from "next/link";
import { BookCopy, FileText, Wrench, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

async function getSubjectDetails(id: string): Promise<Subject | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/api/subjects/${id}`);

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error("Failed to fetch subject details");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching subject details:", error);
    return null;
  }
}

export default async function SubjectLandingPage({
  params,
}: {
  params: { id: string };
}) {
  const subject = await getSubjectDetails((await params).id);

  if (!subject) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <Link
        href="/#subjects"
        className="inline-flex items-center gap-2 text-muted-accent hover:text-accent mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to all subjects
      </Link>
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text">
          {subject.name}
        </h1>
        <p className="mt-2 text-lg text-muted-accent">
          {formatYear(subject.year)}{" "}
          {subject.specialization && subject.specialization !== "Common"
            ? ` - ${subject.specialization}`
            : ""}
        </p>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Chapters - NEW DESIGN */}
        <div className="flex flex-col p-6 bg-card-bg border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <BookCopy className="h-8 w-8 text-accent" />
            <h2 className="text-2xl font-semibold text-text">Chapters</h2>
          </div>
          <ul className="md:text-sm space-y-2 flex-grow">
            {subject.chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/subjects/${subject.id}/chapters/${chapter.id}`}
                  className="text-muted-accent hover:text-accent hover:underline transition-colors"
                >
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2: Past Exams - NEW DESIGN */}
        <div className="flex flex-col p-6 bg-card-bg border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-accent" />
            <h2 className="text-2xl font-semibold text-text">Past Exams</h2>
          </div>
          <ul className="md:text-sm space-y-2 flex-grow">
            <li className="text-muted-accent">Coming Soon...</li>
          </ul>
        </div>

        {/* Card 3: Tools & Resources - NEW DESIGN */}
        <div className="flex flex-col p-6 bg-card-bg border border-border rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="h-8 w-8 text-accent" />
            <h2 className="text-2xl font-semibold text-text">
              Tools & Resources
            </h2>
          </div>
          <ul className="md:text-sm space-y-2 flex-grow">
            <li className="text-muted-accent">Coming Soon...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
