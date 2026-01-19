"use client";

import { useState, useEffect, useRef } from "react";
import type { Subject } from "@/types";
import { PlusCircle, Eye, Edit3 } from "lucide-react";
import Cookies from "js-cookie";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

type AddChapterFormProps = {
  subjectsForYear: Subject[];
};

export default function AddChapterForm({
  subjectsForYear,
}: AddChapterFormProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (subjectsForYear.length > 0) {
      setSelectedSubjectId(subjectsForYear[0].id.toString());
    } else {
      setSelectedSubjectId("");
    }
  }, [subjectsForYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    if (!selectedSubjectId) {
      setError(
        "Please select a subject, or choose a year with available subjects."
      );
      setIsLoading(false);
      return;
    }
    try {
      const token = Cookies.get("access_token");
      if (!token) throw new Error("Authentication token not found.");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${apiUrl}/api/subjects/${selectedSubjectId}/chapters/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content }),
        }
      );
      const resData = await response.json();
      if (!response.ok)
        throw new Error(resData.detail || "Failed to add chapter.");

      setSuccess(`Successfully added chapter "${title}"!`);
      setTitle("");
      setContent("");
      setIsPreviewing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-3">
        <PlusCircle /> Add Chapter to Existing Subject
      </h2>
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

      <div className="border-t border-border pt-6 space-y-4">
        <div>
          <label
            htmlFor="subjectSelect"
            className="block text-sm font-medium text-muted-accent mb-2"
          >
            Select Subject *
          </label>
          <select
            id="subjectSelect"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            required
            className="w-full mt-1 bg-primary border-2 border-border rounded-md px-3 py-2 text-text"
          >
            {subjectsForYear.length > 0 ? (
              subjectsForYear.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}{" "}
                  {subject.specialization && `(${subject.specialization})`}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No subjects found for this year
              </option>
            )}
          </select>
        </div>
        <div>
          <label
            htmlFor="titleExisting"
            className="block text-sm font-medium text-muted-accent mb-2"
          >
            Chapter Title *
          </label>
          <input
            id="titleExisting"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Advanced Sorting Algorithms"
            required
            className="w-full mt-1 bg-primary border-2 border-border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="contentExisting"
              className="text-sm font-medium text-muted-accent"
            >
              Chapter Content *
            </label>
            <button
              type="button"
              onClick={() => setIsPreviewing(!isPreviewing)}
              className="text-xs text-muted-accent flex items-center gap-1 hover:text-accent transition-colors"
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
          {isPreviewing ? (
            <div className="p-4 bg-primary border-2 border-border rounded-md min-h-[308px] max-w-full overflow-x-auto">
              <MarkdownRenderer content={content} />
            </div>
          ) : (
            <textarea
              id="contentExisting"
              ref={contentTextareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Write your chapter content here."
              required
              className="w-full mt-1 bg-primary border-2 border-border rounded-md px-3 py-2 font-mono"
            />
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 font-semibold text-primary bg-accent rounded-md disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add Chapter"}
        </button>
      </div>
    </form>
  );
}
