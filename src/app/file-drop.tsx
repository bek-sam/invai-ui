import { UploadCloud } from "lucide-react";
import type * as React from "react";
import { useCallback, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";

export interface FileDropProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  hint?: string;
  className?: string;
}

/** Drag-and-drop file upload area (CSV imports, artwork uploads). Also supports click-to-browse. */
export function FileDrop({
  onFiles,
  accept,
  multiple = false,
  disabled = false,
  label,
  hint,
  className,
}: FileDropProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t("fileDrop.defaultLabel", "Drag a file here, or click to browse");
  const [isDragging, setIsDragging] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      onFiles(Array.from(fileList));
    },
    [onFiles],
  );

  function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input px-6 py-10 text-center transition-colors",
          "hover:border-primary/50 hover:bg-accent/30",
          isDragging && "border-primary bg-accent/50",
          disabled && "cursor-not-allowed opacity-50 hover:border-input hover:bg-transparent",
          className,
        )}
      >
        <UploadCloud className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium text-foreground">{resolvedLabel}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </button>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
