// frontend/app/profile/contribution/exam/[examId]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { Exam } from "@/types";
import Cookies from "js-cookie";
import Link from "next/link";
import { Loader2, ArrowLeft, Download, Info } from "lucide-react";

type PageProps = { params: Promise<{ examId: string }> };

export default function ViewMyExamPage({ params }: PageProps) {
  const { examId } = use(params);
  const { isLoading: isAuthLoading } = useRequireAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("access_token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(
          `${apiUrl}/api/contributions/my/exam/${examId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch your exam submission.");
        setExam(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExamData();
  }, [examId]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error || "Could not load submission."}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="sticky top-0 bg-yellow-500/10 text-yellow-300 text-sm text-center p-3 flex items-center justify-center gap-2 border-b border-yellow-500/20 z-10 backdrop-blur-sm">
        <Info size={16} />
        This is a preview of your submission. It is currently pending review.
      </div>
      <div className="mt-8">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-muted-accent hover:text-accent mb-8"
        >
          <ArrowLeft size={16} /> Back to My Contributions
        </Link>
      </div>
      <div className="bg-card-bg border border-border rounded-lg overflow-hidden mt-8">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold">Reviewing Your Exam Submission</h1>
          <p className="text-sm text-muted-accent">&quot;{exam.title}&quot;</p>
        </div>
        <div className="p-8 text-center">
          <a
            href={exam.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-accent text-primary rounded-md font-semibold hover:opacity-90"
          >
            <Download size={20} /> View Your Submitted PDF
          </a>
        </div>
      </div>
    </div>
  );
}
