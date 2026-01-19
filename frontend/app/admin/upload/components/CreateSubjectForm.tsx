"use client";

import { useState, useRef } from "react";
import { Book, Eye, Edit3 } from "lucide-react";
import Cookies from "js-cookie";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";

export default function CreateSubjectForm() {
  const [subjectName, setSubjectName] = useState("");
  const [subjectYear, setSubjectYear] = useState("");
  const [subjectSpecialization, setSubjectSpecialization] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!subjectYear) throw new Error("Please select an academic year.");

      const token = Cookies.get("access_token");
      if (!token) throw new Error("Authentication token not found.");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/subjects/with-chapter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject_name: subjectName,
          subject_year: parseInt(subjectYear),
          subject_specialization: subjectSpecialization || "Common",
          chapter_title: title,
          chapter_content: content,
        }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.detail || "An error occurred.");

      setSuccess(`Success! Created subject "${subjectName}".`);
      setSubjectName("");
      setSubjectYear("");
      setSubjectSpecialization("");
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
        <Book /> Create New Subject
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

      <fieldset className="space-y-4 border-t border-border pt-6">
        <legend className="text-lg font-medium mb-2 -ml-1 px-1">
          Subject Information
        </legend>
        <div>
          <label
            htmlFor="subjectName"
            className="block text-sm font-medium text-muted-accent mb-2"
          >
            Subject Title *
          </label>
          <input
            id="subjectName"
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="e.g., Artificial Intelligence"
            required
            className="w-full mt-1 bg-primary border-2 border-border rounded-md px-3 py-2"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="subjectYear"
              className="block text-sm font-medium text-muted-accent mb-2"
            >
              Academic Year *
            </label>
            <select
              id="subjectYear"
              value={subjectYear}
              onChange={(e) => setSubjectYear(e.target.value)}
              required
              className="w-full mt-1 bg-primary border-2 border-border rounded-md px-3 py-2"
            >
              <option value="" disabled>
                Select year
              </option>
              <option value="1">L1</option>
              <option value="2">L2</option>
              <option value="3">L3</option>
              <option value="4">M1</option>
              <option value="5">M2</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="subjectSpecialization"
              className="block text-sm font-medium text-muted-accent mb-2"
            >
              Specialization
            </label>
            <input
              id="subjectSpecialization"
              value={subjectSpecialization}
              onChange={(e) => setSubjectSpecialization(e.target.value)}
              type="text"
              placeholder="e.g., Computer Science"
              className="w-full mt-1 bg-primary border-2 border-border rounded-md px-3 py-2"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-t border-border pt-6">
        <legend className="text-lg font-medium mb-2 -ml-1 px-1">
          First Chapter
        </legend>
        <div>
          <label
            htmlFor="titleNew"
            className="block text-sm font-medium text-muted-accent mb-2"
          >
            Chapter Title *
          </label>
          <input
            id="titleNew"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Introduction to Neural Networks"
            required
            className="w-full mt-1 bg-primary border-2 border-border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-accent">
              Chapter Content *
            </span>
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
              id="contentNew"
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
      </fieldset>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 font-semibold text-primary bg-accent rounded-md disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Subject"}
        </button>
      </div>
    </form>
  );
}
