"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "./image-crop-dialog";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface AnnouncementPhotoUploadProps {
  currentPhotoUrl?: string;
  onUploadComplete?: (photoPath: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  announcementId?: string;
}

export function AnnouncementPhotoUpload({
  currentPhotoUrl,
  onUploadComplete,
  onRemove,
  disabled = false,
  announcementId,
}: AnnouncementPhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(currentPhotoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should not exceed 5MB");
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCropDialogOpen(true);
    },
    []
  );

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);

      // Create FormData
      const formData = new FormData();
      const fileName = `announcement_${announcementId || Date.now()}_${Date.now()}.jpg`;
      formData.append("file", croppedBlob, fileName);
      if (announcementId) {
        formData.append("announcementId", announcementId);
      }

      // Upload to server
      const response = await fetch("/api/upload/announcement-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Update UI with new image
      setUploadedPhotoUrl(data.path);
      onUploadComplete?.(data.path);

      toast.success("Photo uploaded successfully");
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
    }
  };

  const handleRemovePhoto = () => {
    setUploadedPhotoUrl("");
    onRemove?.();
    toast.success("Photo removed");
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {uploadedPhotoUrl ? (
        <div className="space-y-2">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
            {isUploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <Image
                  src={uploadedPhotoUrl}
                  alt="Announcement photo"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePhoto}
                  disabled={disabled || isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleButtonClick}
            disabled={disabled || isUploading}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Photo
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="announcement-photo-input"
            className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:bg-accent/50"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <>
                  <Loader2 className="w-10 h-10 mb-3 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or WEBP (MAX. 5MB)
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
      )}

      <input
        ref={fileInputRef}
        id="announcement-photo-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {previewUrl && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageUrl={previewUrl}
          onCropComplete={handleCropComplete}
          aspect={16 / 9}
          cropShape="rect"
        />
      )}
    </div>
  );
}
