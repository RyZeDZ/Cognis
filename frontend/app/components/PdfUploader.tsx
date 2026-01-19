// frontend/app/components/PdfUploader.tsx
"use client";

import { useRef } from "react";
import { FileUp, XCircle } from "lucide-react";

type PdfUploaderProps = {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
};

export default function PdfUploader({
  onFileSelect,
  selectedFile,
}: PdfUploaderProps) {
  // A ref to programmatically click the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div className="w-full p-6 border-2 border-dashed border-border rounded-lg text-center bg-primary">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf"
      />

      {!selectedFile ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center text-muted-accent hover:text-accent w-full"
        >
          <FileUp size={48} className="mb-2" />
          <span className="font-semibold">Select a PDF file</span>
          <span className="text-xs mt-1">Max size: 10MB</span>
        </button>
      ) : (
        <div className="text-left">
          <p className="font-semibold text-text text-sm mb-2">Selected file:</p>
          <div className="flex items-center justify-between p-2 bg-border rounded-md">
            <span className="text-sm truncate text-text">
              {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={() => {
                onFileSelect(null);
                // Reset the input value so the user can re-select the same file
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="p-1 text-muted-accent hover:text-red-500"
            >
              <XCircle size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
