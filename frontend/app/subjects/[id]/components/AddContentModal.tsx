// frontend/app/subjects/[id]/components/AddContentModal.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { type SubmissionPayload } from "@/types";
import {
  X as CloseIcon,
  Loader2,
  Book,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import Cookies from "js-cookie";

type AddContentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subjectId: number;
};

export default function AddContentModal({
  isOpen,
  onClose,
  subjectId,
}: AddContentModalProps) {
  const router = useRouter();
  const [contentType, setContentType] = useState<"exam" | "resource" | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetFormAndClose = () => {
    setTitle("");
    setUrl("");
    setFile(null);
    setError(null);
    setContentType(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = Cookies.get("access_token");
      if (!token) throw new Error("Authentication required.");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      let endpoint = "";
      let payload: SubmissionPayload;

      if (contentType === "exam" && file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(`${apiUrl}/api/utils/upload-pdf`, {
          method: "POST",
          headers: {
            // DO NOT set Content-Type, the browser does it for FormData
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send the FormData object directly
        });
        const uploadData: { detail?: string; fileUrl?: string } =
          await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadData.detail || "PDF upload failed.");

        endpoint = `${apiUrl}/api/contributions/subjects/${subjectId}/suggest-exam`;
        payload = { type: "exam", title, file_url: uploadData.fileUrl! };
      } else if (contentType === "resource") {
        endpoint = `${apiUrl}/api/contributions/subjects/${subjectId}/suggest-resource`;
        payload = { type: "resource", title, link_url: url };
      } else {
        throw new Error("Invalid content type or missing data.");
      }

      const submitRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!submitRes.ok) {
        // Specify the type for the error data
        const submitData: { detail?: string } = await submitRes.json();
        throw new Error(submitData.detail || "Submission failed.");
      }

      resetFormAndClose();
      router.refresh();
      router.push("/profile");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (contentType === "exam") {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-semibold text-lg text-text">
            Suggest a New Exam
          </h3>
          <div>
            <label
              htmlFor="exam-title"
              className="block text-sm font-medium text-muted-accent mb-1"
            >
              Exam Title *
            </label>
            <input
              id="exam-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="exam-file"
              className="block text-sm font-medium text-muted-accent mb-1"
            >
              PDF File *
            </label>
            <input
              id="exam-file"
              type="file"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              required
              accept=".pdf"
              className="w-full text-sm text-muted-accent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:opacity-90"
            />
          </div>
          <div className="flex justify-end pt-4 gap-4">
            <button
              type="button"
              onClick={() => setContentType(null)}
              className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-border"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-primary bg-accent rounded-md disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Exam"
              )}
            </button>
          </div>
        </form>
      );
    }
    if (contentType === "resource") {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-semibold text-lg text-text">
            Suggest a New Resource
          </h3>
          <div>
            <label
              htmlFor="resource-title"
              className="block text-sm font-medium text-muted-accent mb-1"
            >
              Resource Title *
            </label>
            <input
              id="resource-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="resource-url"
              className="block text-sm font-medium text-muted-accent mb-1"
            >
              Link URL *
            </label>
            <input
              id="resource-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full bg-primary border-2 border-border rounded-md px-3 py-2 text-text focus:ring-accent"
              placeholder="https://example.com"
            />
          </div>
          <div className="flex justify-end pt-4 gap-4">
            <button
              type="button"
              onClick={() => setContentType(null)}
              className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-border"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-primary bg-accent rounded-md disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Resource"
              )}
            </button>
          </div>
        </form>
      );
    }
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push(`/contribute/new-chapter/${subjectId}`)}
          className="w-full flex items-center gap-4 p-4 rounded-lg bg-card-bg hover:bg-border transition-colors text-left"
        >
          <Book size={24} className="text-accent flex-shrink-0" />
          <div>
            <p className="font-semibold text-text">Suggest a New Chapter</p>
            <p className="text-sm text-muted-accent">
              Write a full summary with rich content and images.
            </p>
          </div>
        </button>
        <button
          onClick={() => setContentType("exam")}
          className="w-full flex items-center gap-4 p-4 rounded-lg bg-card-bg hover:bg-border transition-colors text-left"
        >
          <FileText size={24} className="text-accent flex-shrink-0" />
          <div>
            <p className="font-semibold text-text">Suggest a New Exam</p>
            <p className="text-sm text-muted-accent">
              Upload a past exam paper in PDF format.
            </p>
          </div>
        </button>
        <button
          onClick={() => setContentType("resource")}
          className="w-full flex items-center gap-4 p-4 rounded-lg bg-card-bg hover:bg-border transition-colors text-left"
        >
          <LinkIcon size={24} className="text-accent flex-shrink-0" />
          <div>
            <p className="font-semibold text-text">Suggest a New Resource</p>
            <p className="text-sm text-muted-accent">
              Share a useful link, tool, or website.
            </p>
          </div>
        </button>
      </div>
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={resetFormAndClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-primary border border-border rounded-lg shadow-lg z-50 p-6">
          <Dialog.Title className="text-xl font-bold mb-4 text-text">
            Add Content
          </Dialog.Title>
          <Dialog.Description className="text-muted-accent text-sm mb-6">
            Choose the type of content you want to contribute.
          </Dialog.Description>
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 p-1 rounded-full text-muted-accent hover:bg-border"
              aria-label="Close"
            >
              <CloseIcon size={20} />
            </button>
          </Dialog.Close>
          {error && (
            <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          {renderForm()}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
