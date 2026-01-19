// frontend/app/components/CustomDiffViewer.tsx
"use client";

import { diffLines } from "diff";
import { useMemo } from "react";

type DiffViewerProps = {
  oldContent: string;
  newContent: string;
};

export default function CustomDiffViewer({
  oldContent,
  newContent,
}: DiffViewerProps) {
  // useMemo ensures we only recalculate the diff when the content changes.
  const changes = useMemo(() => {
    return diffLines(oldContent || "", newContent || "");
  }, [oldContent, newContent]);

  return (
    <div className="font-mono text-sm border-t border-b border-border bg-primary">
      {changes.map((part, index) => {
        // Determine the style based on whether the part was added, removed, or is common.
        const style = {
          backgroundColor: part.added
            ? "rgba(6, 78, 59, 0.4)"
            : part.removed
            ? "rgba(127, 29, 29, 0.4)"
            : "transparent",
        };
        const prefix = part.added ? "+" : part.removed ? "-" : " ";
        // Determine text color for added/removed lines
        const textColor = part.added
          ? "text-green-400"
          : part.removed
          ? "text-red-400"
          : "text-text";

        // Split the value into individual lines to render them one by one
        const lines = part.value
          .split("\n")
          .filter((line, i, arr) => i < arr.length - 1 || line !== "");

        return lines.map((line, lineIndex) => (
          <div
            key={`${index}-${lineIndex}`}
            style={style}
            className={`flex ${textColor}`}
          >
            <span className="w-8 text-center select-none text-muted-accent flex-shrink-0 px-2">
              {prefix}
            </span>
            <pre className="whitespace-pre-wrap break-words flex-grow pr-4">
              {line || " "}
            </pre>
          </div>
        ));
      })}
    </div>
  );
}
