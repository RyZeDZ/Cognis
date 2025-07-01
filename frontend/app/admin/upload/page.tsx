"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormMode = "newSubject" | "newChapter";

export default function AdminUploadPage() {
  const router = useRouter();

  const [subjectName, setSubjectName] = useState("");
  const [subjectYear, setSubjectYear] = useState(1);
  const [subjectSpecialization, setSubjectSpecialization] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");

  const [mode, setMode] = useState<FormMode>("newSubject");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      // We use the new convenience endpoint we created
      const response = await fetch(`${apiUrl}/api/new-subject-with-chapter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_name: subjectName,
          subject_year: subjectYear,
          subject_specialization: subjectSpecialization || null,
          chapter_title: chapterTitle,
          chapter_content: chapterContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "An error occurred.");
      }

      const newSubject = await response.json();
      setSuccess(`Successfully created subject "${newSubject.name}"!`);
      router.push(`/subjects/${newSubject.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Admin Content Uploader
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-card-bg p-8 rounded-lg border border-border"
      >
        <h2 className="text-2xl font-semibold text-accent">
          Create New Subject with First Chapter
        </h2>

        {/* --- Subject Fields --- */}
        <div>
          <label
            htmlFor="subjectName"
            className="block text-sm font-medium text-muted-accent mb-1"
          >
            Subject Name
          </label>
          <input
            id="subjectName"
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
            className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="subjectYear"
              className="block text-sm font-medium text-muted-accent mb-1"
            >
              Year (1-5)
            </label>
            <input
              id="subjectYear"
              type="number"
              min="1"
              max="5"
              value={subjectYear}
              onChange={(e) => setSubjectYear(parseInt(e.target.value))}
              required
              className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="subjectSpecialization"
              className="block text-sm font-medium text-muted-accent mb-1"
            >
              Specialization (e.g., SI)
            </label>
            <input
              id="subjectSpecialization"
              type="text"
              placeholder="Leave empty for none"
              value={subjectSpecialization}
              onChange={(e) => setSubjectSpecialization(e.target.value)}
              className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent"
            />
          </div>
        </div>

        <hr className="border-border" />

        {/* --- Chapter Fields --- */}
        <div>
          <label
            htmlFor="chapterTitle"
            className="block text-sm font-medium text-muted-accent mb-1"
          >
            First Chapter Title
          </label>
          <input
            id="chapterTitle"
            type="text"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            required
            className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="chapterContent"
            className="block text-sm font-medium text-muted-accent mb-1"
          >
            Chapter Content (Markdown)
          </label>
          <textarea
            id="chapterContent"
            rows={15}
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
            required
            className="w-full bg-primary border border-border rounded-md px-3 py-2 focus:ring-accent focus:border-accent font-mono text-sm"
            placeholder="## My First Heading..."
          />
        </div>

        {/* --- Submission Button & Status --- */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 font-semibold text-primary bg-accent rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Create Subject & Chapter"}
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}
      </form>
    </div>
  );
}
