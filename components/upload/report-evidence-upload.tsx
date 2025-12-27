"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "./image-crop-dialog";
import { X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface ReportEvidenceUploadProps {
  onUploadComplete?: (imagePaths: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
  reportId?: string;
}

export function ReportEvidenceUpload({
  onUploadComplete,
  maxImages = 5,
  disabled = false,
  reportId,
}: ReportEvidenceUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check if max images reached
      if (uploadedImages.length >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should not exceed 10MB");
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCropDialogOpen(true);
    },
    [uploadedImages.length, maxImages]
  );

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      const fileName = `evidence_${reportId || Date.now()}_${Date.now()}.jpg`;
      formData.append("file", croppedBlob, fileName);
      if (reportId) {
        formData.append("reportId", reportId);
      }

      // Upload to server
      const response = await fetch("/api/upload/report-evidence", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Update uploaded images list
      const newImages = [...uploadedImages, data.path];
      setUploadedImages(newImages);
      onUploadComplete?.(newImages);

      toast.success("Evidence photo uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Cleanup
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onUploadComplete?.(newImages);
    toast.success("Photo removed");
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {uploadedImages.length < maxImages && (
        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={disabled || isUploading}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 mb-2 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-1 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload evidence photo</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or WEBP (MAX. 10MB) • {uploadedImages.length}/{maxImages} uploaded
                </p>
              </>
            )}
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedImages.map((imagePath, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={imagePath}
                  alt={`Evidence ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled || isUploading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
              <div className="p-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Evidence {index + 1}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Crop Dialog */}
      {previewUrl && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageUrl={previewUrl}
          onCropComplete={handleCropComplete}
          aspect={4 / 3}
          cropShape="rect"
        />
      )}
    </div>
  );
}
