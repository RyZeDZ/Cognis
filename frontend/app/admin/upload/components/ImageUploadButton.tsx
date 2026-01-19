"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

type ImageUploadButtonProps = {
  setContent: React.Dispatch<React.SetStateAction<string>>;
  onUploadError: (error: string) => void;
  chapterId?: number;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export default function ImageUploadButton({
  setContent,
  onUploadError,
  chapterId,
  textareaRef,
}: ImageUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    onUploadError("");

    const formData = new FormData();
    formData.append("file", file);
    if (chapterId) {
      formData.append("chapter_id", chapterId.toString());
    }

    try {
      const token = Cookies.get("access_token");
      if (!token) throw new Error("Authentication token not found.");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/utils/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Image upload failed.");
      }

      const url = data.imageUrl;
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const imageMarkdown = `\n![Image Description](${url})\n`;

      setContent(
        (prevContent) =>
          prevContent.substring(0, start) +
          imageMarkdown +
          prevContent.substring(end)
      );

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 4, start + 21);
      }, 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      console.error(errorMessage);
      onUploadError(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 text-xs text-muted-accent hover:text-accent disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <UploadCloud size={14} />
        )}
        {isUploading ? "Uploading..." : "Upload Image"}
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
      />
    </div>
  );
}
