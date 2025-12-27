"use client";

import { useCallback, useState } from "react";
import { Upload, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FileUploadConfig {
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  disabled?: boolean;
}

interface FileUploadTemplateProps extends FileUploadConfig {
  files: File[];
  className?: string;
  children?: React.ReactNode;
}

export function FileUploadTemplate({
  accept = "*/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  onFileSelect,
  onFileRemove,
  disabled = false,
  files,
  className,
  children,
}: FileUploadTemplateProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");

  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(2)}MB`;
      }
      return null;
    },
    [maxSize]
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return;

      const newFiles = Array.from(fileList);
      const validFiles: File[] = [];
      let errorMsg = "";

      for (const file of newFiles) {
        const validationError = validateFile(file);
        if (validationError) {
          errorMsg = validationError;
          break;
        }
        validFiles.push(file);
      }

      if (errorMsg) {
        setError(errorMsg);
        setTimeout(() => setError(""), 3000);
        return;
      }

      setError("");
      if (multiple) {
        onFileSelect?.([...files, ...validFiles]);
      } else {
        onFileSelect?.(validFiles.slice(0, 1));
      }
    },
    [files, multiple, onFileSelect, disabled, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      onFileRemove?.(index);
    },
    [onFileRemove]
  );

  return (
    <div className={cn("w-full space-y-4", className)}>
      {children ? (
        <div>
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
            disabled={disabled}
            className="hidden"
            id="file-upload-input"
          />
          {children}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Max size: {(maxSize / (1024 * 1024)).toFixed(2)}MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive font-medium">{error}</div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <File className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
